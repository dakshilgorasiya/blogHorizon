import { getInterests } from "./features/constants/constantsReducers.js";
import { useEffect } from "react";
import { setUser, setErrorMessage } from "./features/auth/authSlice.js";
import axios from "axios";
import { server } from "./constants.js";
import { useDispatch } from "react-redux";
import { CreateBlogPage } from "./pages";

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

  return (
    <>
      <CreateBlogPage />
    </>
  );
}

export default App;
