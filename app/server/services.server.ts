import axiosInstance from "~/config/axios.config";
import { ServiceFormData } from "~/types/services.types";

export async function getAllServices(authToken: string) {
  try {
    const response = await axiosInstance.get("/services", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status === 200) return { services: response.data.services };
  } catch (error) {
    console.log(error);
  }
}

export async function disableServiceById(authToken: string, serviceId: string) {
  try {
    const response = await axiosInstance.delete(`/service/${serviceId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status === 204)
      return {
        success: true,
        message: "Servicio deshabilitado",
      };
  } catch (error) {
    return {
      success: false,
      message: "Error al deshabilitar servicio",
    };
  }
}

export async function enableServiceById(authToken: string, serviceId: string) {
  try {
    const response = await axiosInstance.patch(
      `/service/${serviceId}/enable`,
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
        message: "Servicio habilitado",
      };
  } catch (error) {
    return {
      success: false,
      message: "Error al habilitar servicio",
    };
  }
}

export async function updateService(
  authToken: string,
  serviceFormData: ServiceFormData
) {
  try {
    const response = await axiosInstance.put(
      `/service/${serviceFormData.id}`,
      serviceFormData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200)
      return {
        success: true,
        message: "Servicio actualizado",
      };

    return {
      success: false,
      message: "No se pudo actualizar el servicio",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al actualizar servicio",
    };
  }
}

export async function addService(
  authToken: string,
  serviceFormData: ServiceFormData
) {
  try {
    const response = await axiosInstance.post("/service/", serviceFormData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status === 200)
      return {
        success: true,
        message: "Servicio creado",
      };

    return {
      success: false,
      message: "No se pudo crear el Servicio",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al crear Servicio",
    };
  }
}
