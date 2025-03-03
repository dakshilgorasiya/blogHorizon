import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { server } from "../constants.js";
import { setApiBlog } from "../features/blog/blogSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { Code, Image, Text, Title, UserDetails } from "../components";
import { callSecureApi } from "../utils/callSecureApi.js";
import { Trash2 } from "lucide-react";
import {
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { sendNotification } from "../features/notification/notificationSlice.js";

function ViewBlogPage() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const blogOwner = useSelector((state) => state.blog.blog.owner);

  const { id } = useParams();

  const content = useSelector((state) => state.blog.blog.content);

  const [loading, setLoading] = useState(true);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [error, setError] = useState(null);

  const [adminVerified, setAdminVerified] = useState(false);

  const [reportCount, setReportCount] = useState(0);

  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await callSecureApi({
          url: `${server}/admin/verify-admin`,
          method: "GET",
          setError,
          accessToken: user?.accessToken,
          dispatch,
        });

        console.log(response);

        if (response?.success) {
          console.log("Admin verified");
          setAdminVerified(true);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (user) {
      verifyAdmin();
    }
  }, [user]);

  useEffect(() => {
    async function fetchData(accessToken = user?.accessToken) {
      try {
        setLoading(true);

        const response = await callSecureApi({
          url: `${server}/admin/get-blog-by-id/${id}`,
          method: "GET",
          accessToken,
          setError,
          dispatch,
        });

        setReportCount(response.data.reportCount);

        dispatch(setApiBlog(response.data));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    if (user && adminVerified) fetchData();
  }, [user, adminVerified]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setReason("");
  };

  const handleConfirm = async () => {
    console.log("Deleting item for reason:", reason);

    try {
      setDeleteLoading(true);
      const response = await callSecureApi({
        url: `${server}/admin/delete-blog`,
        method: "POST",
        body: {
          blogId: id,
          reason,
        },
        setError,
        accessToken: user?.accessToken,
        dispatch,
      });

      console.log(response);
      if (response.success) {
        navigate("/admin/dashboard");
        dispatch(
          sendNotification({
            message: "Blog deleted successfully",
            type: "success",
          })
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoading(false);
    }

    setOpen(false);
    setReason("");
  };

  if (loading) {
    return <div>Loading...</div>;
  } else
    return (
      <>
        <div className="">
          <div className="sm:w-11/12 mt-10 p-5 max-w-5xl m-auto flex justify-between items-center">
            <Title />

            <div className="flex gap-2">
              <Tooltip title="Remove blog">
                <button onClick={handleOpen}>
                  <Trash2 size={20} className="text-red-500 cursor-pointer" />
                </button>
              </Tooltip>
            </div>
          </div>
          <div className="sm:w-11/12 px-5 max-w-5xl m-auto">
            <Image imageLink={content[0].data} />
          </div>
          <div className="sm:w-11/12 p-5 max-w-5xl m-auto">
            <UserDetails
              admin={true}
              reportCount={reportCount}
              setReportCount={setReportCount}
            />
          </div>
          <div className="sm:w-11/12 p-5 max-w-5xl m-auto">
            {content.map(
              (item, index) =>
                index != 0 && (
                  <div key={index} className="mb-5">
                    {item.type === "text" && <Text text={item.data} />}
                    {item.type === "code" && <Code data={item.data} />}
                    {item.type === "image" && <Image imageLink={item.data} />}
                  </div>
                )
            )}
          </div>
        </div>

        <Dialog
          open={open}
          onClose={handleClose}
          sx={{ "& .MuiDialog-paper": { width: "500px" } }}
        >
          <div className="">
            <DialogTitle className="text-lg font-bold text-red-500">
              Confirm Deletion
            </DialogTitle>
            <DialogContent>
              <div className="flex flex-col gap-2">
                <label htmlFor="reason" className="text-gray-500">
                  Reason for deletion
                </label>
                <input
                  id="reason"
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="border-2 border-gray-500 rounded-md p-2 focus:outline-none"
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                className="text-gray-500"
                disabled={deleteLoading}
              >
                Cancel
              </Button>

              {deleteLoading ? (
                <Button
                  onClick={handleConfirm}
                  color="error"
                  disabled
                  className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
                >
                  Loading
                </Button>
              ) : (
                <Button
                  onClick={handleConfirm}
                  color="error"
                  disabled={!reason}
                  className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
                >
                  Delete
                </Button>
              )}
            </DialogActions>
          </div>
        </Dialog>
      </>
    );
}

export default ViewBlogPage;
