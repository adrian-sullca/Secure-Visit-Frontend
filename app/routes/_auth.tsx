import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import Footer from "~/components/layout/Footer";
import { json, Outlet, useLoaderData } from "@remix-run/react";
import AuthHeader from "~/components/layout/AuthHeader";
import { getUserByToken, requireAuth } from "~/server/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const authToken = await requireAuth(request);
  const user = await getUserByToken(request);
  return json({
    user: user, 
  });
};

export default function Index() {
  return (
    <>
      <AuthHeader/>
      <main className="pt-28 pb-14 px-4 min-h-screen bg-[#f7f9fb]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
