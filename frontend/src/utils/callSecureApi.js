import axios from "axios";
import { setUser } from "../features/auth/authSlice.js";
import { server } from "../constants.js";

//* This function is used to call the secure APIs. If the access token is expired, it will call the renew-access-token endpoint to get a new access token and then call the API again. If the access token is not expired, it will call the API directly. If the API returns an error, it will set the error message in the state.
const callSecureApi = async ({
  url,
  method = "GET",
  body = null,
  headers = {},
  setError,
  accessToken = null,
  dispatch,
}) => {
  let response = await axios({
    method,
    url,
    data: body,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...headers,
    },
  })
    .then((res) => res.data)
    .catch(async (error) => {
      if (error.response.status === 401) {
        // If the access token is expired, call the renew-access-token endpoint to get a new access token
        const response = await axios
          .post(`${server}/user/renew-access-token`, null, {
            withCredentials: true,
          })
          .then((res) => res.data)
          .catch((error) => {
            throw error;
          });
        accessToken = response.data.accessToken;
        dispatch(setUser(response.data));

        // Call the API again with the new access token
        return await axios({
          method,
          url,
          data: body,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            ...headers,
          },
        })
          .then((res) => res.data)
          .catch((error) => setError(error.response.data.message));
      } else {
        setError(error.response.data.message);
      }
    });

  return response;
};

export { callSecureApi };
