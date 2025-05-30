// import HamburgerMenu from "../utils/HamburgerMenu";
import { NavLink } from "@remix-run/react";
import { SecureVisitLogoBlue } from "./../utils/Icons";

export default function AuthHeader() {
  return (
    <header className="fixed w-full h-14 border-b z-50 bg-white">
      <div className="text-black h-full max-w-7xl flex justify-between mx-auto px-4">
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
          <NavLink
            to="/charts"
            className={({ isActive }) =>
              isActive
                ? "text-custom-blue font-medium px-5 h-full flex items-center transition duration-300 ease-in-out"
                : "hover:text-custom-blue text-gray-600 px-5 h-full font-medium flex items-center transition duration-300 ease-in-out"
            }
          >
            Graficos
          </NavLink>
        </div>
      </div>
    </header>
  );
}
