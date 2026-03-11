"use client";
import { CustomBreadcrumb } from "@/components/shared/breadcrumb/CustomBreadcrumb";
import { DataTable } from "@/components/shared/table/DataTable";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/dist/client/components/navigation";
import { useLocale } from "next-intl";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { columns } from "@/features/customer/components/table/Column";
import {
  deleteCustomer,
  getCustomers,
  restoreCustomer,
} from "@/features/customer/services/customer.service";

const page = () => {
  const breadcrumbData = {
    title: "Customer Management",
    listBreadcrumb: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Customer", href: "/admin/customer" },
    ],
  };
  const router = useRouter();
  const locale = useLocale();
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  function handleSearch(e: any) {
    e.preventDefault();
    const keyword = searchRef.current?.value || "";
    setSearchKeyword(keyword);
  }

  return (
    <div className="h-full w-full">
      <CustomBreadcrumb {...breadcrumbData} />
      <div className="flex items-center justify-between mt-2">
        <form onSubmit={handleSearch} className="w-full max-w-100">
          <Field orientation="horizontal">
            <Input
              type="search"
              placeholder="Enter customername, email, or phone..."
              ref={searchRef}
              className="w-full"
            />
            <Button className="cursor-pointer" type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Button>
          </Field>
        </form>
        <Button onClick={() => router.push(`/${locale}/admin/customer/create`)}>
          <FontAwesomeIcon icon={faPlus} />
          New Customer
        </Button>
      </div>
      <div className="mt-2">
        <DataTable
          objPath="customer"
          columns={columns}
          getData={getCustomers}
          hasTrash={true}
          deleteAction={deleteCustomer}
          restoreAction={restoreCustomer}
          searchKeyword={searchKeyword}
        />
      </div>
    </div>
  );
};

export default page;
