import type { MetaFunction } from "@remix-run/node";
import { Button } from "../components/ui/button";


export const meta: MetaFunction = () => {
  return [
    { title: "Login" },
    { name: "description", content: "Inicia sesión" },
  ];
};

export default function AuthPage() {
  return (
    <>
      <Button>Click aaaamaaae</Button>
    </>
  );
}
