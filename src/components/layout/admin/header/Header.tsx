"use client";
import Navbar from "./components/Navbar";
import { useSidebarStore } from "@/store/sidebar.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const Header = () => {
  const { toggleSidebar } = useSidebarStore();
  return (
    <header className="h-12 w-screen bg-primary fixed top-0 z-100">
      <div className="w-full h-full flex justify-between py-1 px-10 items-center">
        <div className="flex items-center">
          <Link
            href={"/admin/dashboard"}
            className="font-bold 
            text-xs sm:text-sm md:text-2xl
            mr-5 sm:mr-10 md:mr-20
            text-primary-foreground"
          >
            iTravel Admin
          </Link>
          <Button
            variant={"ghost"}
            onClick={() => toggleSidebar()}
            className="rounded-full w-10 h-10 p-0 cursor-pointer hover:text-primary-foreground"
          >
            <FontAwesomeIcon
              icon={faBars}
              className="cursor-pointer text-primary-foreground"
            />
          </Button>
        </div>
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
