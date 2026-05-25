import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import { auth } from "../firebase/firebase";

function Dashboard({ role }) {
  const logout = async () => {
    await signOut(auth);
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="flex justify-end mb-5">
        <button
          onClick={logout}
          className="bg-red-500 text-white px-5 py-3 rounded-xl"
        >
          Logout
        </button>
      </div>
      <h1 className="text-4xl font-bold text-center mb-10">
        Uniform Business Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-5">
        <div
          onClick={() => navigate("/stitching")}
          className="bg-white p-10 rounded-2xl shadow-lg text-center text-2xl font-semibold cursor-pointer"
        >
          Stitching
        </div>

        <div
          onClick={() => navigate("/summary")}
          className="bg-white p-10 rounded-2xl shadow-lg text-center text-2xl font-semibold cursor-pointer"
        >
          Worker Summary
        </div>

        <div
          onClick={() => navigate("/turpai")}
          className="bg-white p-10 rounded-2xl shadow-lg text-center text-2xl font-semibold cursor-pointer"
        >
          Turpai
        </div>

        <div
          onClick={() => navigate("/ironing")}
          className="bg-white p-10 rounded-2xl shadow-lg text-center text-2xl font-semibold cursor-pointer"
        >
          Ironing
        </div>

        <div
          onClick={() => navigate("/stock")}
          className="bg-white p-10 rounded-2xl shadow-lg text-center text-2xl font-semibold cursor-pointer"
        >
          Stock Management
        </div>

        <div
          onClick={() => navigate("/advances")}
          className="bg-white p-10 rounded-2xl shadow-lg text-center text-2xl font-semibold cursor-pointer"
        >
          Advances
        </div>

        <div
          onClick={() => navigate("/reports")}
          className="bg-white p-10 rounded-2xl shadow-lg text-center text-2xl font-semibold cursor-pointer"
        >
          Reports
        </div>

        <div
          onClick={() => navigate("/workers")}
          className="bg-white p-10 rounded-2xl shadow-lg text-center text-2xl font-semibold cursor-pointer"
        >
          Workers
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
