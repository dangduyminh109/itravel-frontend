import { ColumnDef } from "@tanstack/react-table";
import { Category } from "../../types/category.type";
import { formatDate } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/shared/table/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Category>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="name" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <p>{row.original.name}</p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<"ACTIVE" | "INACTIVE">("status");
      return status === "ACTIVE" ? (
        <Badge className="bg-[var(--success)] hover:bg-[var(--success)]">
          {status}
        </Badge>
      ) : (
        <Badge className="bg-[var(--warning)] hover:bg-[var(--warning)]">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue<string>("createdAt");
      return formatDate({ dateString: createdAt, type: "datetime" });
    },
  },
];
