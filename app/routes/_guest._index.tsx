import {
  redirect,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { Button } from "../components/ui/button";
import { sessionStorage } from "~/server/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Login" },
    { name: "description", content: "Inicia sesión" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const authToken = session.get("authToken");

  if (authToken) {
    return redirect("/visits");
  }

  return null;
};

export default function AuthPage() {
  return (
    <>
      <Button>Click aaaamaaae</Button>
    </>
  );
}
