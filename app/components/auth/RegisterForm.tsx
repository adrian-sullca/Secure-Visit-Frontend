import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { ValidationMessages } from "~/types/general.types";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";
  const actionData = useActionData<ValidationMessages>();

  return (
    <Form
      method="post"
      className="space-y-6 bg-white p-8 rounded-lg border shadow"
    >
      {actionData?.serverSideValidationErrors?.message && (
        <span className="text-red-500 text-center font-semibold text-sm">
          {actionData.serverSideValidationErrors.message}
        </span>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Nombre</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Adrian Sullca"
            className="pl-10"
            required
          />
          {actionData?.clientSideValidationErrors?.name && (
            <span className="text-red-500 font-semibold text-sm">
              {actionData.clientSideValidationErrors.name}
            </span>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            className="pl-10"
            required
          />
          {actionData?.clientSideValidationErrors?.email && (
            <span className="text-red-500 font-semibold text-sm">
              {actionData.clientSideValidationErrors.email}
            </span>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10"
            required
          />
          {actionData?.clientSideValidationErrors?.password && (
            <span className="text-red-500 font-semibold text-sm">
              {actionData.clientSideValidationErrors.password}
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password_confirmation"
            name="password_confirmation"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10"
            required
          />
          {actionData?.clientSideValidationErrors?.password_confirmation && (
            <span className="text-red-500 font-semibold text-sm">
              {actionData.clientSideValidationErrors.password_confirmation}
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      <div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Registrando..." : "Registrarse"}
        </Button>
      </div>
      <input
        type="text"
        className="hidden"
        name="mode"
        defaultValue="register"
      />
    </Form>
  );
}
