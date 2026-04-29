import { ColumnDef } from "@tanstack/react-table";
import { Tour } from "@/features/tour/types/tour.type";
import { formatDate } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/shared/table/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Tour>[] = [
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
        <img
          src={row.original.thumbnailUrl}
          alt={row.original.name}
          className="h-8 w-8 rounded-md object-cover"
        />
        <p>{row.original.name}</p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<"ACTIVE" | "INACTIVE" | "DRAFT">("status");
      switch (status) {
        case "DRAFT":
          return (
            <Badge className="bg-muted hover:bg-muted text-primary">
              {status}
            </Badge>
          );
        case "INACTIVE":
          return (
            <Badge className="bg-[var(--warning)] hover:bg-[var(--warning)]">
              {status}
            </Badge>
          );
        case "ACTIVE":
          return (
            <Badge className="bg-[var(--success)] hover:bg-[var(--success)]">
              {status}
            </Badge>
          );
      }
    },
  },
  {
    accessorKey: "categoryName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="category" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <p>{row.original.categoryName}</p>
      </div>
    ),
  },
  {
    accessorKey: "destinationLocation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="destination" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <p>{row.original.destinationLocation}</p>
      </div>
    ),
  },
  {
    accessorKey: "departureLocation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="departure" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <p>{row.original.departureLocation}</p>
      </div>
    ),
  },
];
