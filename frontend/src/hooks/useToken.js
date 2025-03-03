import { useState } from "react";
import axios from "axios";
import { server } from "../constants.js";
import { useDispatch } from "react-redux";
import { setUser } from "../features/auth/authSlice.js";

const useToken = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const renewAccessToken = async () => {
    try {
      setLoading(true);
      const response = await axios
        .post(`${server}/user/renew-access-token`, null, {
          withCredentials: true,
        })
        .then((res) => res.data)
        .catch((error) => {
          throw error;
        });

      if (response.success) {
        dispatch(setUser(response.data));
      }
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { renewAccessToken, loading, error };
};

export default useToken;
