import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { server } from "../../constants";
import useSecureAPI from "../../hooks/useSecureApi";

function ReportCard({ data, solved = false, setReportCount }) {
  const dispatch = useDispatch();

  const { callAPI } = useSecureAPI();

  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const [latestSolved, setLatestSolved] = useState(solved);

  const [error, setError] = useState(null);

  const handleSolved = async () => {
    try {
      const response = await callAPI({
        url: `${server}/admin/mark-report-as-resolved/${data._id}`,
        method: "PUT",
        accessToken: user?.accessToken,
        dispatch,
        setError,
      });

      if (response?.success) {
        setLatestSolved(true);
        setReportCount((prev) => prev - 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`p-5 bg-white shadow-md rounded-lg ${
        latestSolved ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-start">
          <img
            src={data.owner.avatar}
            alt="avatar"
            className="h-10 w-10 rounded-full"
          />
          <h1 className="ml-2 font-semibold mt-0.5">{data.owner.userName}</h1>
        </div>
        <h1 className="text-xs text-gray-500">
          {new Date(data.createdAt).toDateString()}
        </h1>
      </div>

      <div className="flex justify-between mt-2">
        <div>
          <h1 className={`font-bold text-xl `}>{data.title}</h1>
          <p>{data.content}</p>
        </div>

        <div className="flex items-center">
          {loading ? (
            <button
              onClick={handleSolved}
              className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled
            >
              Loading..
            </button>
          ) : (
            <button
              onClick={handleSolved}
              className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={latestSolved}
            >
              Mark as Solved
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportCard;
