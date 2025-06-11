import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import UsersTable from "~/components/users/UsersTable";
import { requireAuth } from "~/server/auth.server";
import {
  addUser,
  disableUserById,
  enableUserById,
  getAllUsers,
  updateUser,
} from "~/server/users.server";
import { UserFormData } from "~/types/user.types";
import { validateUserFormData } from "~/validations/users.validations";

export const meta: MetaFunction = () => {
  return [
    { title: "Users Management" },
    { name: "description", content: "Gestion de usuarios" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const authToken = await requireAuth(request);
  const resUsers = await getAllUsers(authToken);
  return json({ users: resUsers?.users });
};

export const action: ActionFunction = async ({ request }) => {
  const authToken = await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const userId = formData.get("user_id") as string;

  if (intent === "disable") {
    return await disableUserById(authToken, userId);
  } else if (intent === "enable") {
    return await enableUserById(authToken, userId);
  } else if (intent === "update") {
    const userData: UserFormData = {
      intent: intent,
      id: Number(formData.get("user_id") || 0),
      name: String(formData.get("user_name") || ""),
      email: String(formData.get("user_email") || ""),
      password: String(formData.get("user_password") || ""),
      admin: formData.get("user_admin") === "1" ? true : false,
      enabled: formData.get("user_enabled") === "1" ? true : false,
    };

    const clientSideValidationErrors = validateUserFormData(userData);

    if (clientSideValidationErrors) {
      return json({
        success: false,
        intent,
        message: "Corrige los errores del formulario",
        clientSideValidationErrors,
      });
    }

    return await updateUser(authToken, userData);
  } else if (intent == "add") {
    const userData: UserFormData = {
      intent: intent,
      name: String(formData.get("user_name") || ""),
      email: String(formData.get("user_email") || ""),
      password: String(formData.get("user_password") || ""),
      password_confirmation: String(formData.get("user_password") || ""),
      enabled: true,
      admin: formData.get("user_admin") === "1" ? true : false,
    };

    const clientSideValidationErrors = validateUserFormData(userData);

    if (clientSideValidationErrors) {
      return json({
        success: false,
        intent,
        message: "Corrige los errores del formulario",
        clientSideValidationErrors,
      });
    }

    return await addUser(authToken, userData);
  }

  return json({ error: "Acción no válida" }, { status: 400 });
};

export default function UsersManagementPage() {
  return (
    <div className="w-full flex justify-center">
      <UsersTable />
    </div>
  );
}
