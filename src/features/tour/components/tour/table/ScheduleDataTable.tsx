"use client";

import { DataTableViewOptions } from "@/components/shared/table/DataTableViewOptions";
import { useLoadingStore } from "@/store/loading.store";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/shared/table/DataTablePagination";
import ApiResponse, { PagingResponse } from "@/types/ApiResponse.type";

interface ScheduleDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  setValue: any;
  getData: (args: any) => Promise<ApiResponse<PagingResponse<TData[]>>>;
  isView?: boolean;
}
export function ScheduleDataTable<TData, TValue>({
  columns,
  getData,
  setValue,
  isView,
}: ScheduleDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [totalPages, setTotalPages] = useState(0);
  const { setLoading } = useLoadingStore();
  const [data, setData] = useState<TData[]>([]);
  useEffect(() => {
    const fetchDataAndSetData = async () => {
      const result = await getData({
        page: pagination.pageIndex,
        size: pagination.pageSize,
      });
      if (result.success) {
        setData(result.response.data);
        setTotalPages(result.response.totalPages);
      }
    };
    fetchDataAndSetData();
  }, [getData, pagination]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    pageCount: totalPages,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const handleSelectedRow = (rowId: string) => {
    const selectedRow = table.getRow(rowId).original as any;
    if (selectedRow && !isView) {
      setValue("id", selectedRow.id);
      setValue("departureDate", selectedRow.departureDate);
      setValue("totalSeats", selectedRow.totalSeats);
      setValue("surcharge", selectedRow.surcharge);
      setValue("status", selectedRow.status || "OPEN");
      setValue(
        "pricing.adultPrice.originalPrice",
        selectedRow.pricing?.adultPrice?.originalPrice,
      );
      setValue(
        "pricing.adultPrice.discountPrice",
        selectedRow.pricing?.adultPrice?.discountPrice || null,
      );
      setValue(
        "pricing.childPrice.originalPrice",
        selectedRow.pricing?.childPrice?.originalPrice,
      );
      setValue(
        "pricing.childPrice.discountPrice",
        selectedRow.pricing?.childPrice?.discountPrice || null,
      );
      setValue(
        "pricing.infantPrice.originalPrice",
        selectedRow.pricing?.infantPrice?.originalPrice,
      );
      setValue(
        "pricing.infantPrice.discountPrice",
        selectedRow.pricing?.infantPrice?.discountPrice || null,
      );
      setValue(
        "pricing.singleSupplement",
        selectedRow.pricing?.singleSupplement || 0,
      );
      setValue("pricing.currency", selectedRow.pricing?.currency || "VND");
    } else if (isView && selectedRow) {
      setValue(selectedRow);
    }
  };

  return (
    <div className="overflow-hidden rounded-md border bg-background border-primary">
      <div className="flex items-center justify-between p-2 gap-2">
        <DataTableViewOptions table={table} />
      </div>

      <div className="rounded-lg m-2 overflow-auto max-h-100 max-w-[100%] border border-muted shadow">
        <Table>
          <TableHeader className="bg-foreground [&_tr:hover]:bg-foreground [&_th]:!text-background [&_th]:!whitespace-nowrap">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleSelectedRow(row.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No schedules found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

export default ScheduleDataTable;
