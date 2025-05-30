import type { MetaFunction } from "@remix-run/node";
import Footer from "~/components/layout/Footer";
import { Outlet } from "@remix-run/react";
import AuthHeader from "~/components/layout/AuthHeader";

export default function Index() {
  return (
    <>
      <AuthHeader />
      <main className="pt-28 pb-14 px-4 min-h-screen bg-[#f7f9fb]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
