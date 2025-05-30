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
      <main className="flex h-screen items-center justify-center bg-primary-color px-6">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
