"use client";
import { DataTable } from "@/components/shared/table/DataTable";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { columns } from "./LocationColumn";
import {
  deleteLocation,
  getLocations,
  restoreLocation,
} from "../../services/location.service";
import { useRouter } from "next/dist/client/components/navigation";
import { Fragment, useRef, useState } from "react";
import { useLocale } from "next-intl";

const LocationTable = () => {
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
              placeholder="Enter location name..."
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
          onClick={() => router.push(`/${locale}/admin/location/create`)}
        >
          <FontAwesomeIcon icon={faPlus} />
          New Location
        </Button>
      </div>
      <div className="mt-2">
        <DataTable
          objPath="location"
          columns={columns}
          getData={getLocations}
          hasTrash={true}
          deleteAction={deleteLocation}
          restoreAction={restoreLocation}
          searchKeyword={searchKeyword}
        />
      </div>
    </Fragment>
  );
};

export default LocationTable;
