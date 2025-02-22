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
    if(response.success){
      dispatch(setUser(response.data));
    }
    if (response.success) dispatch(setUser(response.data));
    return response;
  } catch (error) {
    console.log(error);
  }
};

export { renewAccessToken };
