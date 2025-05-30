// import HamburgerMenu from "../utils/HamburgerMenu";
import { NavLink } from "@remix-run/react";
import { SecureVisitLogoBlue } from "./../utils/Icons";

export default function GuestHeader() {
  return (
    <header className="fixed w-full h-14 border-b z-50 bg-white">
      <div className="text-black h-full max-w-7xl flex justify-between mx-auto px-6">
        <NavLink to="/" className="h-full flex items-center">
          <SecureVisitLogoBlue />
        </NavLink>
        <div className="flex items-center">
          <NavLink
            to="/auth"
            className={({ isActive }) =>
              isActive
                ? "text-custom-blue font-medium px-5 h-full flex items-center transition duration-300 ease-in-out"
                : "hover:text-custom-blue px-5 h-full font-medium flex items-center transition duration-300 ease-in-out"
            }
          >
            Inicia sesión
          </NavLink>
        </div>
      </div>
    </header>
  );
}
