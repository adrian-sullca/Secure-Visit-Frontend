import { json, LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLocation } from "@remix-run/react";
import AuthHeader from "~/components/layout/AuthHeader";
import Footer from "~/components/layout/Footer";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getUserByToken, requireAuth } from "~/server/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const authToken = await requireAuth(request);
  const user = await getUserByToken(request);
  return json({
    user: user,
  });
};

export default function AdminLayout() {
  const location = useLocation();

  let activeTab = "resumen";
  if (location.pathname.startsWith("/admin/dashboard/motives")) activeTab = "motives";
  else if (location.pathname.startsWith("/admin/dashboard/services"))
    activeTab = "services";
  else if (location.pathname.startsWith("/admin/dashboard/companies"))
    activeTab = "companies";
  else if (location.pathname.startsWith("/admin/dashboard/users"))
    activeTab = "users";
  else if (location.pathname.startsWith("/admin/dashboard"))
    activeTab = "resumen";

  return (
    <>
      <AuthHeader />
      <main className="pt-28 pb-14 px-4 min-h-screen bg-[#f7f9fb]">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} className="w-full space-y-8">
            <TabsList className="grid w-full grid-cols-5">
              <Link to="/admin/dashboard">
                <TabsTrigger className="w-full" value="resumen">
                  Resumen
                </TabsTrigger>
              </Link>
              <Link to="/admin/dashboard/motives">
                <TabsTrigger className="w-full" value="motives">
                  Motivos
                </TabsTrigger>
              </Link>
              <Link to="/admin/dashboard/services">
                <TabsTrigger className="w-full" value="services">
                  Services
                </TabsTrigger>
              </Link>
              <Link to="/admin/dashboard/companies">
                <TabsTrigger className="w-full" value="companies">
                  Empresas
                </TabsTrigger>
              </Link>
              <Link to="/admin/dashboard/users">
                <TabsTrigger className="w-full" value="users">
                  Usuarios
                </TabsTrigger>
              </Link>
            </TabsList>
          </Tabs>
        </div>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
