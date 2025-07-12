import { FcGoogle } from "react-icons/fc";

const Form = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg py-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
          FounderIQ
        </h2>
        <form className="space-y-4 mb-10">
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded cursor-pointer"
          >
            <FcGoogle className="inline-block mr-2" size={28} />
            Login with Google
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          © Copyright 2025&nbsp;
          <span className="font-semibold text-gray-600">FounderIQ.</span>
          &nbsp;All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Form;
