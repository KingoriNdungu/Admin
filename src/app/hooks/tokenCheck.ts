import axios from "axios";

import Cookies from "js-cookie";
import axiosApi from "./interceptor";
const getData = async () => {
  const baseUrl = `/api`;
  try {
    // const refreshToken: string | undefined = Cookies.get("refreshToken");
    // const res = await axios.get(`${baseUrl}`, {
    //   withCredentials: true,
    //   headers: {
    //     'x-api-key': `${process.env.NEXT_PUBLIC_API_KEY}`,
    //     'Cookie': `refreshToken ${refreshToken}`
    //   }

    // });
    const res = await axiosApi.post("/organization/refresh");
    return res.data;
    // return `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh_token`
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error; // Rethrow the error to handle it elsewhere
  }
};

export default getData;
