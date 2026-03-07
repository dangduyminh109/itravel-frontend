import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { FieldGroup, Field } from "@/components/ui/field";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons";
import { Permission } from "@/types/permission";
import { toast } from "sonner";
import { getPermissions } from "../services/permission.service";
import { PermissionOverride } from "../types/user.type";

const PermissionPopup = ({
  defaultSelectedPermissions,
  permissionOverrides,
  setPermissionOverrides,
}: {
  defaultSelectedPermissions: string[];
  permissionOverrides: PermissionOverride[];
  setPermissionOverrides: React.Dispatch<
    React.SetStateAction<PermissionOverride[]>
  >;
}) => {
  const [permissionList, setPermissionList] = useState<Permission[]>([]);

  useEffect(() => {
    const fetchPermission = async () => {
      const result = await getPermissions();
      if (result.success) {
        setPermissionList(result.response);
      } else {
        toast.error(result.message || "Failed to fetch permissions");
      }
    };
    fetchPermission();
  }, []);

  function handleSelectedPermissionChange(
    permission: Permission,
    checked: boolean | "indeterminate",
  ) {
    if (defaultSelectedPermissions.includes(permission.code)) {
      if (checked) {
        const newList: PermissionOverride[] = permissionOverrides.filter(
          (override) => {
            return override.permission !== permission.code;
          },
        );
        setPermissionOverrides([...newList]);
      } else {
        const newList: PermissionOverride[] = [
          ...permissionOverrides,
          {
            permission: permission.code,
            permissionType: "DENY",
          },
        ];
        setPermissionOverrides([...newList]);
      }
    } else {
      if (checked) {
        const newList: PermissionOverride[] = [
          ...permissionOverrides,
          {
            permission: permission.code,
            permissionType: "GRANT",
          },
        ];
        setPermissionOverrides([...newList]);
      }
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="link"
            className="w-full h-full block cursor-pointer"
            tabIndex={-1}
          >
            advanced
            <FontAwesomeIcon icon={faScrewdriverWrench} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">
              Override permissions
            </DialogTitle>
          </DialogHeader>
          <FieldGroup className="max-w-sm max-h-[400px] overflow-y-auto">
            {permissionList &&
              permissionList.map((permission) => {
                return (
                  <Field orientation="horizontal" key={permission.code}>
                    <Checkbox
                      id={permission.code}
                      name={permission.code}
                      className="rounded-xs"
                      onCheckedChange={(checked) =>
                        handleSelectedPermissionChange(permission, checked)
                      }
                      checked={
                        permissionOverrides.some(
                          (p) =>
                            p.permission === permission.code &&
                            p.permissionType === "GRANT",
                        ) ||
                        (defaultSelectedPermissions.includes(permission.code) &&
                          !permissionOverrides.some(
                            (p) =>
                              p.permission === permission.code &&
                              p.permissionType === "DENY",
                          ))
                      }
                    />
                    <Label className="rounded-sm" htmlFor={permission.code}>
                      {permission.description}
                    </Label>
                  </Field>
                );
              })}
          </FieldGroup>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PermissionPopup;
