import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      setMessage(res.data.message || "If an account with that email exists, a reset link has been sent.");
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md border dark:border-gray-700"
      >
        <h2 className="text-2xl font-bold mb-2 text-center text-indigo-600">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
          Enter your account email and we'll send you a link to reset your password.
        </p>

        {message && (
          <p className="bg-green-100 text-green-700 text-sm p-2 rounded mb-4">{message}</p>
        )}
        {error && (
          <p className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">{error}</p>
        )}

        {!submitted && (
          <>
            <label className="block mb-5">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full border dark:border-gray-700 rounded px-3 py-2 focus:outline-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        )}

        <p className="text-sm text-center mt-4">
          <Link to="/login" className="text-indigo-600 font-medium">Back to Login</Link>
        </p>
      </form>
    </div>
  );
}
