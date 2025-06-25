import { Link, NavLink, useLoaderData } from "@remix-run/react";
import { SecureVisitLogoBlue } from "~/components/utils/Icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { User as UserIcon } from "lucide-react";
import { loader } from "~/routes/_auth";

export default function AuthHeader() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <header className="fixed w-full h-14 border-b z-50 bg-white">
      <div className="container text-black h-full max-w-7xl flex justify-between mx-auto px-4 xl:px-0">
        <SecureVisitLogoBlue />
        <div className="flex items-center">
          <NavLink
            to="/visits"
            className={({ isActive }) =>
              isActive
                ? "text-custom-blue font-medium px-5 h-full flex items-center transition duration-300 ease-in-out"
                : "hover:text-custom-blue text-gray-600 px-5 h-full font-medium flex items-center transition duration-300 ease-in-out"
            }
          >
            Visitas
          </NavLink>
          {user.admin == true ? (
            <NavLink
              to="/admin/dashboard/visitors"
              className={({ isActive }) =>
                isActive
                  ? "text-custom-blue font-medium px-5 h-full flex items-center transition duration-300 ease-in-out"
                  : "hover:text-custom-blue text-gray-600 px-5 h-full font-medium flex items-center transition duration-300 ease-in-out"
              }
            >
              Panel de admin
            </NavLink>
          ) : (
            ""
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <>
                  <UserIcon className="text-gray-600"></UserIcon>
                  <span className="text-gray-700">{user.name}</span>
                </>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" side="bottom" align="end">
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/logout">
                <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
