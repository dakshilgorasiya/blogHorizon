import { HomePage } from "./pages";
import { useDispatch } from "react-redux";
import { sendNotification } from "./features/notification/notificationSlice.js";

function App() {
  const dispatch = useDispatch();

  const handleClick = () => {
    console.log("CLICKED");
    dispatch(
      sendNotification({
        message: "Hello world",
        type: "success",
      })
    );
  };

  return (
    <>
      <div className="p-0 m-0">
        <HomePage />
      </div>
      <button onClick={handleClick} className="btn btn-primary">
        Click me
      </button>
    </>
  );
}

export default App;
