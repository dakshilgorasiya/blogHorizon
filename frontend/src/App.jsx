import { Login, Register } from "./components";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./features/auth/authReducers.js";
import { getInterests } from "./features/constants/constantsReducers.js";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getInterests());
  },[]);

  return (
    <>
      HOME
    </>
  );
}

export default App;
