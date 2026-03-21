import {
  faHouse,
  faUser,
  faUserGear,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export type SidebarItem =
  | { name: string; icon: React.ReactNode; path: string }
  | { name: string; icon: React.ReactNode; path: string; items: SidebarItem[] };

const fileTree: SidebarItem[] = [
  {
    name: "dashboard",
    icon: <FontAwesomeIcon icon={faHouse} />,
    path: "/admin/dashboard",
  },
  {
    name: "user",
    icon: <FontAwesomeIcon icon={faUser} />,
    path: "/admin/user",
  },
  {
    name: "customer",
    icon: <FontAwesomeIcon icon={faUsers} />,
    path: "/admin/customer",
  },
  {
    name: "role",
    icon: <FontAwesomeIcon icon={faUserGear} />,
    path: "/admin/role",
  },
];

export default fileTree;
