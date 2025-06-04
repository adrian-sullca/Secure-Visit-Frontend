import axiosInstance from "~/config/axios.config";

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
