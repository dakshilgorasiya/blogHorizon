import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { server } from "../../constants.js";
import { useSelector, useDispatch } from "react-redux";
import { callSecureApi } from "../../utils/callSecureApi.js";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { sendNotification } from "../../features/notification/notificationSlice.js";

const DeleteBlog = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [error, setError] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const user = useSelector((state) => state.auth.user);

  const handleConfirm = async () => {
    // Perform the delete action here
    console.log(id);

    try {
      const response = await callSecureApi({
        url: `${server}/blog/delete-blog/${id}`,
        method: "DELETE",
        setError,
        accessToken: user?.accessToken,
        dispatch,
      });

      if (response.success) {
        navigate("/");
        dispatch(
          sendNotification({
            message: "Blog deleted successfully",
            type: "success",
          })
        );
      }
    } catch (error) {
      console.log(error);
    }

    setOpen(false);
  };

  return (
    <div>
      <Button color="error" onClick={handleClickOpen}>
        <Tooltip title="Delete Blog" arrow>
          <Trash2 size={20} className="text-red-500" />
        </Tooltip>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this blog?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteBlog;
