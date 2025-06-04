import { LoaderFunction } from "@remix-run/node";
import { logout } from "~/server/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  return await logout(request);
};

export default function Logout() {
  return null;
}