import type { MetaFunction } from "@remix-run/node";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useState } from "react";
import LoginForm from "~/components/auth/LoginForm";
import { ActionFunctionArgs, data } from "@remix-run/node";
import { validateLoginFormData } from "~/validations/auth.validations";
import { login } from "~/server/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Login" },
    { name: "description", content: "Inicia sesión" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  if (formData.get("mode") == "login") {
    const loginFormData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const clientSideValidationErrors = validateLoginFormData(loginFormData);

    if (clientSideValidationErrors)
      return data({ clientSideValidationErrors }, { status: 400 });

    return await login(loginFormData);
  } else if (formData.get("mode") == "register") {
    // TODO: Implementar register
  }
}

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  return (
    <div className="w-full space-y-8">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold">
          Bienvenido a <span className="text-custom-blue">Secure Visit</span>
        </h1>
        <p className="text-gray-600 mt-2">
          {activeTab === "login"
            ? "Inicia sesión para acceder a tu cuenta"
            : "Crea una cuenta para comenzar"}
        </p>
      </div>
      <div className="max-w-xl mx-auto">
        <Tabs
          value={activeTab}
          onValueChange={(tabValue) => handleTabChange(tabValue)}
          className="w-full space-y-8"
        >
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="login" className="h-10">
              Iniciar Sesión
            </TabsTrigger>
            <TabsTrigger value="register" className="h-10">
              Registrarse
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <h1>Register</h1>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
