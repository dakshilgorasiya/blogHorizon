import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <AlertTriangle size={64} className="text-red-500 mb-4" />
      <h1 className="text-4xl font-bold text-gray-800">
        Oops! Something went wrong.
      </h1>
      <p className="text-lg text-gray-600 mt-2 mb-5">It's not you, it's us.</p>
      <Link to="/">
        <button className="bg-priary hover:bg-highlight text-white font-bold py-2 px-4 rounded">
          Go Home
        </button>
      </Link>
    </div>
  );
}

export default ErrorPage;
