"use client";
import { DataTable } from "@/components/shared/table/DataTable";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { columns } from "@/features/tour/components/tour/table/Column";
import { useRouter } from "next/dist/client/components/navigation";
import { Fragment, useRef, useState } from "react";
import { useLocale } from "next-intl";
import {
  deleteTour,
  getTours,
  restoreTour,
} from "@/features/tour/services/tour.service";

const Table = () => {
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
    <Fragment>
      <div className="flex items-center justify-between mt-4">
        <form onSubmit={handleSearch} className="w-full max-w-100">
          <Field orientation="horizontal">
            <Input
              type="search"
              placeholder="Enter tour name..."
              ref={searchRef}
              className="w-full"
            />
            <Button className="cursor-pointer" type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Button>
          </Field>
        </form>
        <Button
          className="cursor-pointer"
          onClick={() => router.push(`/${locale}/admin/tour/create`)}
        >
          <FontAwesomeIcon icon={faPlus} />
          New Tour
        </Button>
      </div>
      <div className="mt-2">
        <DataTable
          objPath="tour"
          columns={columns}
          getData={getTours}
          hasTrash={true}
          deleteAction={deleteTour}
          restoreAction={restoreTour}
          searchKeyword={searchKeyword}
        />
      </div>
    </Fragment>
  );
};

export default Table;
