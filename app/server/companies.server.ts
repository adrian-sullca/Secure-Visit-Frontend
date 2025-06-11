import axiosInstance from "~/config/axios.config";
import { CompanyFormData } from "~/types/companies.types";
import { UserFormData } from "~/types/user.types";

export async function getAllCompanies(authToken: string) {
  try {
    const response = await axiosInstance.get("/companies", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status === 200) return { companies: response.data.companies };
  } catch (error) {
    console.log(error);
  }
}

export async function disableCompanyById(authToken: string, companyId: string) {
  try {
    const response = await axiosInstance.delete(`/company/${companyId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status === 204)
      return {
        success: true,
        message: "Empresa deshabilitado",
      };
  } catch (error) {
    return {
      success: false,
      message: "Error al deshabilitar empresa",
    };
  }
}

export async function enableCompanyById(authToken: string, companyId: string) {
  try {
    const response = await axiosInstance.patch(
      `/company/${companyId}/enable`,
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
        message: "Empresa habilitado",
      };
  } catch (error) {
    return {
      success: false,
      message: "Error al habilitar empresa",
    };
  }
}

export async function updateCompany(
  authToken: string,
  companyFormData: CompanyFormData
) {
  try {
    const response = await axiosInstance.put(
      `/company/${companyFormData.id}`,
      companyFormData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200)
      return {
        success: true,
        message: "Empresa actualizada",
      };

    return {
      success: false,
      message: "No se pudo actualizar la empresa",
    };
  } catch (error) {
    console.log(error.response.data.errors)
    const rawErrors = error.response?.data?.errors || {};
    const serverSideValidationErrors: Record<string, string> = {};

    for (const key in rawErrors) {
      if (Array.isArray(rawErrors[key]) && rawErrors[key].length > 0) {
        serverSideValidationErrors[key] = rawErrors[key][0]
          .replace("The ", "")
          .replace(".", "")
          .trim();
      }
    }

    return {
      success: false,
      message: "Error al actualizar empresa",
      serverSideValidationErrors,
    };
  }
}

export async function addCompany(
  authToken: string,
  companyFormData: CompanyFormData
) {
  try {
    const response = await axiosInstance.post("/company/", companyFormData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status === 200)
      return {
        success: true,
        message: "Empresa creada",
      };

    return {
      success: false,
      message: "No se pudo crear la empresa",
    };
  } catch (error) {
    // console.error(error.response.data);
    return {
      success: false,
      message: "Error al crear empresa",
    };
  }
}
