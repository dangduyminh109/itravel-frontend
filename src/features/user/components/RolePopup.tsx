import { Role } from "@/features/role/types/role.type";
import { useEffect, useState } from "react";
import { getRoles } from "../../role/services/role.service";
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
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const RolePopup = ({
  setSelectedRole,
  selectedRole,
}: {
  setSelectedRole: React.Dispatch<React.SetStateAction<Set<Role>>>;
  selectedRole: Set<Role>;
}) => {
  const [roleList, setRoleList] = useState<Set<Role>>(new Set());
  useEffect(() => {
    async function fetchRoles() {
      const result = await getRoles("ACTIVE");
      setRoleList(new Set(result.response));
    }
    fetchRoles();
  }, []);

  function handleSeledtedRoleChange(
    role: Role,
    checked: boolean | "indeterminate",
  ) {
    if (checked) {
      setSelectedRole((prev) => new Set([...prev, role]));
    } else {
      setSelectedRole((prev) => {
        const newSet = new Set(prev);
        return new Set([...newSet].filter((r) => r.id !== role.id));
      });
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full h-full block">
            <FontAwesomeIcon icon={faCaretDown} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Choose role</DialogTitle>
          </DialogHeader>
          <FieldGroup className="max-w-sm max-h-[400px] overflow-y-auto">
            {roleList &&
              [...roleList].map((role) => {
                return (
                  <Field orientation="horizontal" key={role.id}>
                    <Checkbox
                      id={role.id}
                      name={role.id}
                      className="rounded-xs"
                      onCheckedChange={(checked) =>
                        handleSeledtedRoleChange(role, checked)
                      }
                      checked={[...selectedRole].some((r) => r.id === role.id)}
                    />
                    <Label className="rounded-sm" htmlFor={role.id}>
                      {role.name}
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

export default RolePopup;
