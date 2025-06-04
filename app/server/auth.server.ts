import { createCookieSessionStorage, json, redirect } from "@remix-run/node";
import { LoginFormData, RegisterFormData } from "~/types/auth.types";
import axiosInstance from "~/config/axios.config";
import axios, { isAxiosError } from "axios";

export async function requireAuth(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const authToken = session.get("authToken");

  if (!authToken) {
    throw redirect("/?mode=login");
  }

  return authToken;
}

export async function getUserByToken(request: Request) {
  const response = await axios.get("http://localhost/api/user", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${await requireAuth(request)}`,
    },
    withCredentials: true,
  });
  return response.data.user;
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "authToken",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  },
});

async function createUserSession(authToken: string, admin: boolean) {
  const session = await sessionStorage.getSession();
  session.set("authToken", authToken);
  if (admin) {
    return redirect("/admin/dashboard", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
  }

  return redirect("/visits", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function login({ email, password }: LoginFormData) {
  try {
    const response = await axiosInstance.post("/login", { email, password });

    if (response.status === 200) {
      const admin = Boolean(response.data.user.admin);
      return await createUserSession(response.data.token, admin);
    }
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return json(
        {
          serverSideValidationErrors: {
            message: "incorrect_email_or_password",
          },
        },
        { status: 401 }
      );
    }

    return json(
      { unexpectedError: { message: "Unexpected server error" } },
      { status: 500 }
    );
  }
}

export async function register({
  name,
  email,
  password,
  password_confirmation,
}: RegisterFormData) {
  try {
    const response = await axiosInstance.post("/register", {
      name,
      email,
      password,
      password_confirmation,
    });

    if (response.status == 201) {
      return await login({ email, password });
    }
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 422) {
      const { message, errors } = error.response.data;

      const formattedErrors: Record<string, string> = {
        message,
      };

      for (const field in errors) {
        if (Array.isArray(errors[field])) {
          formattedErrors[field] = errors[field][0];
        } else {
          formattedErrors[field] = errors[field];
        }
      }

      return json(
        { serverSideValidationErrors: formattedErrors },
        { status: 422 }
      );
    }

    return json(
      { unexpectedError: { message: "Unexpected server error." } },
      { status: 500 }
    );
  }
}

export async function logout(request: Request) {
  await axiosInstance.post("/logout", null, {
    headers: {
      Authorization: `Bearer ${await requireAuth(request)}`,
    },
  });

  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  session.unset("authToken");
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}