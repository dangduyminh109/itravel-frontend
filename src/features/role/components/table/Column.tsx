import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/shared/table/DataTableColumnHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Customer } from "@/features/customer/types/customer.type";

export const columns: ColumnDef<Customer>[] = [
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
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="fullName" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <Avatar className="cursor-pointer h-8 w-8">
          <AvatarImage src={row.original.avatar} alt={row.original.fullName} />
          <AvatarFallback>
            {row.original.fullName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <p>{row.original.fullName}</p>
      </div>
    ),
  },
  {
    accessorKey: "dateOfBirth",
    header: "Date of Birth",
    cell: ({ row }) => {
      const dateOfBirth = row.getValue<string>("dateOfBirth");
      return (
        dateOfBirth && formatDate({ dateString: dateOfBirth, type: "date" })
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.getValue<"MALE" | "FEMALE" | "OTHER">("gender");
      return gender;
    },
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
