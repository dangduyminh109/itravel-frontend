import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/shared/table/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Schedule } from "@/features/tour/types/tour.type";
export const columns: ColumnDef<Schedule>[] = [
  {
    accessorKey: "departureDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Departure Date" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <p>
          {formatDate({
            dateString: row.original.departureDate.toString(),
            type: "datetime",
          })}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<
        "UPCOMING" | "OPEN" | "FULL" | "CANCELLED" | "COMPLETED"
      >("status");
      return <Badge>{status}</Badge>;
    },
  },
  {
    accessorKey: "totalSeats",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Seats" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <p>{row.original.totalSeats}</p>
      </div>
    ),
  },
  {
    accessorKey: "surcharge",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Surcharge" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <p>{row.original.surcharge}</p>
      </div>
    ),
  },
  {
    accessorKey: "AdultPrice",
    header: "Adult Price",
    cell: ({ row }) => (
      <Table>
        <TableHeader className="bg-primary [&_tr:hover]:bg-foreground [&_th]:!text-background [&_th]:!whitespace-nowrap">
          <TableRow>
            <TableHead>Original</TableHead>
            <TableHead>Discount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              {row.original.pricing?.adultPrice?.originalPrice}
            </TableCell>
            <TableCell>
              {row.original.pricing?.adultPrice?.discountPrice}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ),
  },
  {
    accessorKey: "ChildPrice",
    header: "Child Price",
    cell: ({ row }) => (
      <Table>
        <TableHeader className="bg-primary [&_tr:hover]:bg-foreground [&_th]:!text-background [&_th]:!whitespace-nowrap">
          <TableRow>
            <TableHead>Original</TableHead>
            <TableHead>Discount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              {row.original.pricing?.childPrice?.originalPrice}
            </TableCell>
            <TableCell>
              {row.original.pricing?.childPrice?.discountPrice}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ),
  },
  {
    accessorKey: "InfantPrice",
    header: "Infant Price",
    cell: ({ row }) => (
      <Table>
        <TableHeader className="bg-primary [&_tr:hover]:bg-foreground [&_th]:!text-background [&_th]:!whitespace-nowrap">
          <TableRow>
            <TableHead>Original</TableHead>
            <TableHead>Discount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              {row.original.pricing?.infantPrice?.originalPrice}
            </TableCell>
            <TableCell>
              {row.original.pricing?.infantPrice?.discountPrice}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ),
  },
];
