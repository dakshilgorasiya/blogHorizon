import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../features/auth/authSlice.js";
import { server } from "../constants.js";

const useSecureAPI = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const callAPI = async ({
    url,
    method = "GET",
    body = null,
    headers = {},
  }) => {
    setLoading(true);
    let accessToken = user?.accessToken;

    try {
      let response = await axios({
        method,
        url,
        data: body,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...headers,
        },
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          // Refresh token
          const refreshResponse = await axios.post(
            `${server}/user/renew-access-token`,
            null,
            {
              withCredentials: true,
            }
          );

          const newAccessToken = refreshResponse.data.accessToken;
          dispatch(setUser(refreshResponse.data));

          // Retry API call with new token
          const retryResponse = await axios({
            method,
            url,
            data: body,
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              ...headers,
            },
          });

          return retryResponse.data;
        } catch (refreshError) {
          setError("Session expired. Please log in again.");
        }
      } else {
        setError(error.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return { callAPI, error, loading };
};

export default useSecureAPI;
