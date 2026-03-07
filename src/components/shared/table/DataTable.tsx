"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  VisibilityState,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  faArrowRotateLeft,
  faCircleInfo,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import { useEffect, useState } from "react";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { DataTablePagination } from "./DataTablePagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";
import ApiResponse, { PagingResponse } from "@/types/ApiResponse.type";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  getData: (args: any) => Promise<ApiResponse<PagingResponse<TData[]>>>;
  hasTrash?: boolean;
  searchKeyword?: string;
  deleteAction?: (id: string) => Promise<ApiResponse<null>>;
}

export function DataTable<TData, TValue>({
  columns,
  hasTrash = true,
  deleteAction,
  getData,
  searchKeyword = "",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<TData[]>([]);
  const [trash, setTrash] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter();
  useEffect(() => {
    const fetchDataAndSetData = async () => {
      const result = await getData({
        deleted: trash,
        page: pagination.pageIndex,
        size: pagination.pageSize,
        keyword: searchKeyword,
      });
      if (result.success) {
        setData(result.response.data);
        setTotalPages(result.response.totalPages);
      }
    };
    fetchDataAndSetData();
  }, [getData, trash, pagination, searchKeyword]);

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

  async function handleDelete({ row }: { row: any }) {
    const user = row.original as any;
    if (deleteAction) {
      const result = await deleteAction(user.id);
      if (result.success) {
        toast.success(
          trash ? "Destroyed successfully" : "Deleted successfully",
        );
        const result = await getData({
          deleted: trash,
          page: pagination.pageIndex,
          size: pagination.pageSize,
          keyword: searchKeyword,
        });
        if (result.success) {
          setData(result.response.data);
        }
      } else {
        toast.error(result.message || "An error occurred");
      }
    }
  }

  function handleToggleDetail({ row }: { row: any }) {
    const user = row.original as any;
    router.push(`/admin/user/${user.id}`);
  }

  return (
    <div className="overflow-hidden rounded-md border bg-background border-primary">
      <div className="flex items-center p-2 gap-2">
        <DataTableViewOptions table={table} />
        {hasTrash && (
          <Button
            variant={trash ? "outline" : "default"}
            size="sm"
            onClick={() => setTrash && setTrash(!trash)}
          >
            <FontAwesomeIcon icon={faTrashCan} />
            Trash
          </Button>
        )}
      </div>

      <div className="rounded-lg m-2 overflow-scroll max-h-100 max-w-[100%] border border-muted shadow">
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
                <TableHead>Actions</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => handleToggleDetail({ row })}
                          variant="outline"
                          size="icon"
                          className="cursor-pointer bg-[var(--info)] hover:bg-[var(--info)] hover:opacity-80 !text-white"
                        >
                          <FontAwesomeIcon icon={faCircleInfo} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Detail</p>
                      </TooltipContent>
                    </Tooltip>
                    {trash && hasTrash ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="cursor-pointer bg-[var(--success)] hover:bg-[var(--success)] hover:opacity-80 !text-white"
                          >
                            <FontAwesomeIcon icon={faArrowRotateLeft} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Restore</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="cursor-pointer bg-[var(--warning)] hover:bg-[var(--warning)] hover:opacity-80 !text-white"
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="cursor-pointer bg-[var(--error)] hover:bg-[var(--error)] hover:opacity-80 text-white"
                          onClick={() => handleDelete({ row })}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{trash && hasTrash ? "Destroy" : "Delete "}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No results.
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
