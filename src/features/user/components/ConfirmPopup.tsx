"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

export interface ConfirmData {
  openPopup: boolean;
  title: ReactNode;
  description: ReactNode;
  handler: () => void;
  confirmText?: string;
  confirmVariant?: "default" | "destructive";
}

interface ConfirmPopupProps {
  confimData: ConfirmData;
  setConfirmData: (data: ConfirmData) => void;
}

const ConfirmPopup = (props: ConfirmPopupProps) => {
  const { openPopup, title, description, handler } = props.confimData;
  return (
    <Dialog
      open={openPopup}
      onOpenChange={(isOpen) =>
        props.setConfirmData({ ...props.confimData, openPopup: isOpen })
      }
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="cursor-pointer" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="cursor-pointer"
            type="submit"
            variant={props.confimData.confirmVariant || "default"}
            onClick={() => handler && handler()}
          >
            {props.confimData.confirmText || "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmPopup;
