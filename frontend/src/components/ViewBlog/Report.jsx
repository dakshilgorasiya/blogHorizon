import React, { useState, useEffect } from "react";
import { ReportCard } from "../../components";
import { server } from "../../constants";
import useSecureAPI from "../../hooks/useSecureApi";
import { useSelector, useDispatch } from "react-redux";

function Report({ blogId, setReportCount }) {
  const dispatch = useDispatch();

  const { callAPI } = useSecureAPI();

  const [data, setData] = useState([]);

  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await callAPI({
          url: `${server}/admin/get-reports-by-blog-id/${blogId}`,
          method: "GET",
          accessToken: user?.accessToken,
          dispatch,
          setError,
        });

        if (response?.success) {
          setData(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReports();
    }
  }, [user]);

  return (
    <>
      {data && data.length === 0 && (
        <>
          <div className="flex justify-center font-bold text-lg">
            No reports found
          </div>
        </>
      )}
      <div className="p-0 m-0 grid gap-2">
        {data.map((report) => (
          <ReportCard
            key={report._id}
            data={report}
            solved={report.isSolved}
            setReportCount={setReportCount}
          />
        ))}
      </div>
    </>
  );
}

export default Report;
