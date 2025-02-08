import { Login, Register } from "./components";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./features/auth/authReducers.js";

function App() {
  const dispatch = useDispatch();

  return (
    <>
      <div className="p-0 m-0">
        <Login />
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          dispatch(logout());
        }}
      >
        Logout
      </button>
    </>
  );
}

export default App;
