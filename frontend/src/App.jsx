import { Login, Register } from "./components";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./features/auth/authReducers.js";
import { getInterests } from "./features/constants/constantsReducers.js";
import { useEffect } from "react";
import { setUser, setErrorMessage } from "./features/auth/authSlice.js";
import axios from "axios";
import { server } from "./constants.js";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInterests());

    const fetchUser = async () => {
      try {
        const response = await axios
          .post(`${server}/user/renew-access-token`, null, {
            withCredentials: true,
          })
          .then((res) => res.data)
          .catch((error) => {
            throw error;
          });
        dispatch(setUser(response));
      } catch (error) {
        setErrorMessage(error.response.data.message);
      }
    };

    fetchUser();
  }, []);

  return <>HOME</>;
}

export default App;
