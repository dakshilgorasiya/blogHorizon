import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";

function Notify({ message, setOpen, open, type }) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const action = (
    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={type === "success" ? "success" : "error"} // Dynamic type
        variant="filled"
        sx={{
          width: "100%",
          backgroundColor: type === "success" ? "#39e600" : "#ef5350", // Custom colors
          color: "#fff", // White text for contrast
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default Notify;
