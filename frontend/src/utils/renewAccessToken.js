import axios from "axios";
import { server } from "../constants.js";
import { setUser } from "../features/auth/authSlice.js";

const renewAccessToken = async ({ dispatch, setError }) => {
  try {
    const response = await axios
      .post(`${server}/user/renew-access-token`, null, {
        withCredentials: true,
      })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
    dispatch(setUser(response.data));
  } catch (error) {
    console.log(error);
    setError(error);
  }
};

export { renewAccessToken };
