import type { MetaFunction } from "@remix-run/node";
import GuestHeader from "~/components/layout/GuestHeader";
import Footer from "~/components/layout/Footer";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <>
      <GuestHeader />
      <main className="pt-28 pb-14 px-4 xs:px-8 sm:px-20 min-h-screen bg-[#f7f9fb]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
