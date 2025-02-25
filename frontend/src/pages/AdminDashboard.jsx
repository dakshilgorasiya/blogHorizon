import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { server } from "../constants.js";
import { callSecureApi } from "../utils/callSecureApi.js";

function AdminDashboard() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);

  const [adminVerified, setAdminVerified] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await callSecureApi({
          url: `${server}/user/verify-admin`,
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
      if (user.role !== "admin") {
        navigate("/");
      }
      verifyAdmin();
    }
  }, [user]);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await callSecureApi({
          url: `${server}/report/get-reports`,
          method: "POST",
          body: { limit: 10, page: 1 },
          setError,
          accessToken: user?.accessToken,
          dispatch,
        })

        console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (user && adminVerified) {
      fetchReports();
    }
  }, [user, adminVerified]);

  return (
    <>
      <div>AdminDashboard</div>
    </>
  );
}

export default AdminDashboard;
