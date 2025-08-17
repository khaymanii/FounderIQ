import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/chat");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg py-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
          Founder<span className="text-purple-800">IQ</span>
        </h2>
        <div className="space-y-4 mb-10">
          <button
            onClick={signInWithGoogle}
            className="w-full bg-purple-800 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-purple-900 transition-colors cursor-pointer"
          >
            <FcGoogle size={28} />
            Login with Google
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © Copyright 2025
          <span className="font-semibold text-gray-600">
            Founder<span className="text-purple-800">IQ</span>
          </span>{" "}
          - All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Form;
