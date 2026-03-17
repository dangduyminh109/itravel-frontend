"use client";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRightIcon } from "lucide-react";
import { useSidebarStore } from "@/store/sidebar.store";
import fileTree, { SidebarItem } from "./components/collapsibleSidebarTree";
import { useRouter } from "next/dist/client/components/navigation";
import { useLocale } from "next-intl";

const renderItem = (
  fileItem: SidebarItem,
  activeItem: string,
  setActive: (name: string) => void,
) => {
  const router = useRouter();
  const locale = useLocale();
  if ("items" in fileItem) {
    return (
      <Collapsible key={fileItem.name}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="group w-full justify-between transition-none 
            hover:bg-accent cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {fileItem.icon && fileItem.icon}
              {fileItem.name}
            </div>
            <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1 ml-5 style-lyra:ml-4">
          <div className="flex flex-col gap-1">
            {fileItem.items.map((child) => renderItem(child, activeItem, setActive))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Button
      key={fileItem.name}
      onClick={() => {
        router.push(`/${locale}/${fileItem.path}`);
        setActive(fileItem.name);
      }}
      variant={activeItem === fileItem.name ? "default" : "ghost"}
      className="w-full justify-start gap-2 text-background-foreground cursor-pointer"
    >
      {fileItem.icon && fileItem.icon}
      <span>{fileItem.name}</span>
    </Button>
  );
};

const Sidebar = () => {
  const { isOpen, toggleSidebar , activeItem, setActiveItem} = useSidebarStore();
  return (
    <>
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="md:hidden fixed h-screen w-screen z-40 inset-0 bg-secondary-foreground/50 flex items-center justify-center"
        ></div>
      )}
      <aside
        className={`h-full z-50 
         overflow-x-hidden w-0
         bg-secondary transition-all duration-300 
         fixed md:relative text-primary-foreground 
         [&>*]:text-lg
         ${isOpen ? "w-70 p-2" : "w-0 p-0"}`}
      >
        <div className="flex flex-col gap-1 py-2">
          {fileTree.map((item) => renderItem(item, activeItem, setActiveItem))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
