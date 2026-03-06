"use client";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Fragment } from "react/jsx-runtime";
import { useLocale } from "next-intl";

export type CustomBreadcrumbProps = {
  title: string;
  listBreadcrumb: {
    name: string;
    href: string;
  }[];
};

export function CustomBreadcrumb({
  title,
  listBreadcrumb,
}: CustomBreadcrumbProps) {
  return (
    <div className="p-2">
      <h1 className="font-bold text-xl">{title}</h1>
      <Separator className="mb-1" />
      <Breadcrumb>
        <BreadcrumbList>
          <RenderBreadcrumb listBreadcrumb={listBreadcrumb} />
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

const RenderBreadcrumb = ({
  listBreadcrumb,
}: {
  listBreadcrumb: CustomBreadcrumbProps["listBreadcrumb"];
}) => {
  const locale = useLocale();

  if (!listBreadcrumb || listBreadcrumb.length === 0) {
    return null;
  } else if (listBreadcrumb.length < 5) {
    return listBreadcrumb.map((item, index) => {
      return (
        <Fragment key={item.name}>
          <BreadcrumbItem>
            {index != listBreadcrumb.length - 1 ? (
              <BreadcrumbLink asChild>
                <Link href={`/${locale}${item.href}`}>{item.name}</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>
                {listBreadcrumb[listBreadcrumb.length - 1].name}
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
          {index !== listBreadcrumb.length - 1 && <BreadcrumbSeparator />}
        </Fragment>
      );
    });
  }
  return (
    <>
      <BreadcrumbItem key={listBreadcrumb[0].name}>
        <BreadcrumbLink asChild>
          <Link href={`/${locale}${listBreadcrumb[0].href}`}>
            {listBreadcrumb[0].name}
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost">
            <BreadcrumbEllipsis />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {listBreadcrumb.slice(1, listBreadcrumb.length - 1).map((item) => (
              <DropdownMenuItem key={item.name}>
                <Link href={`/${locale}${item.href}`}>{item.name}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>
          {listBreadcrumb[listBreadcrumb.length - 1].name}
        </BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
};
