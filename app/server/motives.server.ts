import axiosInstance from "./../config/axios.config";

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