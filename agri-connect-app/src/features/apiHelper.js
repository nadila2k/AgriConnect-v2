import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_API_PATH,
});

apiClient.interceptors.request.use(
  (config) => {
    if (
      config.method === "post" ||
      config.method === "put" ||
      config.method === "patch"
    ) {
      // config.headers["Content-Type"] = "application/json";

      if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
      } else {
        config.headers["Content-Type"] = "application/json";
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "An unexpected error occurred";
    return Promise.reject(new Error(errorMessage));
  }
);


const apiHelper = async (method, requestOptions, thunkAPI = null) => {
  try {
    let response;
    if (method === "post" || method === "put" || method === "patch") {
      response = await apiClient[method](
        requestOptions.url,
        requestOptions.data
      );
    } else if (method === "get") {
      response = await apiClient[method](requestOptions.url);
    } else if (method === "delete") {
      response = await apiClient[method](requestOptions.url);
    } else {
      throw new Error("Unsupported HTTP method");
    }
    return response;
  } catch (error) {
    if (thunkAPI) {
      return thunkAPI.rejectWithValue(error.message);
    }
    return { error: error.message };
  }
};

export default apiHelper;
