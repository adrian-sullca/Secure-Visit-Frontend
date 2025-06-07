import axiosInstance from "~/config/axios.config";
import { MotiveFormData } from "~/types/motives.types";

export async function getAllMotives(authToken: string) {
  try {
    const response = await axiosInstance.get("/motives", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status === 200) return { motives: response.data.motives };
  } catch (error) {
    console.log(error);
  }
}

export async function disableMotiveById(authToken: string, motiveId: string) {
  try {
    const response = await axiosInstance.delete(`/motive/${motiveId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status === 204)
      return {
        success: true,
        message: "Motivo deshabilitado",
      };
  } catch (error) {
    return {
      success: false,
      message: "Error al deshabilitar motivo",
    };
  }
}

export async function enableMotiveById(authToken: string, motiveId: string) {
  try {
    const response = await axiosInstance.patch(
      `/motive/${motiveId}/enable`,
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
        message: "Motivo habilitado",
      };
  } catch (error) {
    return {
      success: false,
      message: "Error al habilitar motivo",
    };
  }
}

export async function updateMotive(
  authToken: string,
  motiveFormData: MotiveFormData
) {
  try {
    const response = await axiosInstance.put(
      `/motive/${motiveFormData.id}`,
      motiveFormData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200)
      return {
        success: true,
        message: "Motivo actualizado",
      };

    return {
      success: false,
      message: "No se pudo actualizar el motivo",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al actualizar motivo",
    };
  }
}


export async function addMotive(
  authToken: string,
  motiveFormData: MotiveFormData
) {
  try {
    const response = await axiosInstance.post(
      '/motive/',
      motiveFormData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200)
      return {
        success: true,
        message: "Motivo creado",
      };

    return {
      success: false,
      message: "No se pudo crear el motivo",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al crear motivo",
    };
  }
}
