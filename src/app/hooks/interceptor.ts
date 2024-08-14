

let axios: any;
let refreshToken: string | undefined;
let accessToken: string | undefined;

const initAxios = async () => {
  if (!axios) {
    // Dynamically import axios only when needed
    const axiosModule = await import("axios");
    axios = axiosModule.default;

    // Set axios defaults
    axios.defaults.baseURL = `/api`;
    axios.defaults.withCredentials = true;

    // Function to refresh cookies before each request
    const refreshCookies = () => {
      const cookies = document.cookie
        .split("; ")
        .reduce((prev: any, current: string) => {
          const [name, value] = current.split("=");
          prev[name] = value;
          return prev;
        }, {});

      refreshToken = cookies.refreshToken;
      accessToken = cookies.accessToken;

      axios.defaults.headers.common[
        "Cookie"
      ] = `resfreshToken=${refreshToken};accessToken=${accessToken}`;
      // axios.defaults.headers.common['x-api-key'] = `${process.env.NEXT_PUBLIC_API_KEY}`;
    };

    // Initial cookie refresh
    // refreshCookies();

    // Set up axios interceptors to refresh cookies before each request
    axios.interceptors.request.use(
      async (config: any) => {
        // refreshCookies();
        return config;
      },
      (error: any) => {
        const expectedError =
          error.response &&
          error.response.status >= 400 &&
          error.response.status < 500;

        if (!expectedError) {
          console.log("Oh my, something just went wrong!");
        }

        return Promise.reject(error);
      }
    );
  }

  return axios;
};

interface AxiosInstance {
  get: (...args: any) => Promise<any>;
  post: (...args: any) => Promise<any>;
  put: (...args: any) => Promise<any>;
  delete: (...args: any) => Promise<any>;
}

const axiosApi: AxiosInstance = {
  get: async (...args: any) => (await initAxios()).get(...args),
  post: async (...args: any) => (await initAxios()).post(...args),
  put: async (...args: any) => (await initAxios()).put(...args),
  delete: async (...args: any) => (await initAxios()).delete(...args),
};

export default axiosApi;
