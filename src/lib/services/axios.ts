import axios from "axios";

let axiosClient = axios.create({});

axiosClient.interceptors.request.use(
  function (config: any) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const sendRequest = <T>(
  path: string,
  method: string = "GET",
  data: any = null,
  headers = null,
  contentType = "application/json"
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const params = {
      url: `/api/${path}`,
      method,
      headers: {
        "Content-Type": contentType,
        ...(headers || {}),
      },
      params: {},
      data: {},
    };
    if (data !== null) {
      if (method === "GET") {
        params.params = data;
      } else if (
        method === "POST" ||
        method === "PUT" ||
        method === "PATCH" ||
        method === "DELETE"
      ) {
        params.data = data;
      }
    }
    axiosClient(params)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((error) => {
        if (error.response) {
          // HTTP-related errors:
          const { status, data: errorData } = error.response;

          if (status === 500) {
            // Handle internal server errors gracefully:
            console.error(
              "Server error (500):",
              error.response.data.message || "Internal server error"
            );

            reject(new Error("Token Expired"));
          } else if (status === 401 || status === 403) {
            // Handle authentication/authorization errors:
            console.error("Unauthorized (401/403):", errorData.message);
            reject(new Error("Unauthorized")); // Redirect to login or handle gracefully
          } else if (status === 400) {
            // Handle bad request errors:
            console.error("Bad request (400):", errorData.message);
            reject(new Error("Bad request")); // Display errors to the user
          } else {
            reject(new Error(errorData.message));
          }
        }
      });
  });
};
export default sendRequest;
