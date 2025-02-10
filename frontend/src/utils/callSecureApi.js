import axios from "axios";
import { server } from "../constants.js";
import { setUser } from "../features/auth/authSlice.js";


//* This function is used to call the secure APIs. If the access token is expired, it will call the renew-access-token endpoint to get a new access token and then call the API again. If the access token is not expired, it will call the API directly. If the API returns an error, it will set the error message in the state.
const callSecureApi = async ({
  url,
  method = "GET",
  body = null,
  headers = {},
  setError,
  token,
}) => {
  try {
    const response = await axios({
      url,
      method,
      data: body,
      headers: {
        "Content-Type": "application/json",
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.data);

    return response;
  } catch (error) {
    if (error.response.data.message === "Invalid access token") {
      // hit the refresh token endpoint
      const response = await axios
        .post(`${server}/user/renew-access-token`, null, {
          withCredentials: true,
        })
        .then((res) => res.data);

      // if success, call the api again
      if (response.success) {
        setUser(response.data);
        const response = await callSecureApi({
          url,
          method,
          body,
          headers,
          setError,
          token: newToken,
        });
        return response;
      }
    } else {
      setError(error.response.data.message);
    }
  }
};
