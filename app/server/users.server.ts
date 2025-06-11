import axiosInstance from "~/config/axios.config";
import { UserFormData } from "~/types/user.types";

export async function getAllUsers(authToken: string) {
  try {
    const response = await axiosInstance.get("/users", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status === 200) return { users: response.data.users };
  } catch (error) {
    console.log(error);
  }
}

export async function disableUserById(authToken: string, userId: string) {
  try {
    const response = await axiosInstance.delete(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status === 204)
      return {
        success: true,
        message: "Usuario deshabilitado",
      };
  } catch (error) {
    return {
      success: false,
      message: "Error al deshabilitar usuario",
    };
  }
}

export async function enableUserById(authToken: string, userId: string) {
  try {
    const response = await axiosInstance.patch(
      `/user/${userId}/enable`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 204)
      return {
        success: true,
        message: "Usuario habilitado",
      };
  } catch (error) {
    return {
      success: false,
      message: "Error al habilitar usuario",
    };
  }
}

export async function updateUser(
  authToken: string,
  userFormData: UserFormData
) {
  try {
    const response = await axiosInstance.put(
      `/user/${userFormData.id}`,
      userFormData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200)
      return {
        success: true,
        message: "Usuario actualizado",
      };

    return {
      success: false,
      message: "No se pudo actualizar el usuario",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al actualizar usuario",
      // TODO: TRADUCIR
      serverSideValidationErrors: {
        // email: error.response.data.errors.email
        email: "Email en uso"
      },
    };
  }
}

export async function addUser(authToken: string, userFormData: UserFormData) {
  try {
    const response = await axiosInstance.post("/user/", userFormData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status === 200)
      return {
        success: true,
        message: "Usuario creado",
      };

    return {
      success: false,
      message: "No se pudo crear el usuario",
    };
  } catch (error) {
    console.error(error.response.data);
    return {
      success: false,
      message: "Error al crear usuario",
    };
  }
}
