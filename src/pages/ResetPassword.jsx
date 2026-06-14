import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../services/api";
import { passwordsMatch } from "../utils/validators";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Reset token is missing. Please use the link from your email.");
      return;
    }

    if (!passwordsMatch(passwords.newPassword, passwords.confirmPassword)) {
      setError("New password and confirm password do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({ token, newPassword: passwords.newPassword });
      setMessage(res.data.message || "Password reset successfully.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
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
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          Reset Password
        </h2>

        {!token && (
          <p className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">
            No reset token found. Please use the link from your email.
          </p>
        )}

        {message && (
          <p className="bg-green-100 text-green-700 text-sm p-2 rounded mb-4">{message}</p>
        )}
        {error && (
          <p className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">{error}</p>
        )}

        <label className="block mb-3">
          <span className="text-sm font-medium">New Password</span>
          <input
            type="password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            required
            minLength={6}
            className="mt-1 w-full border dark:border-gray-700 rounded px-3 py-2 focus:outline-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </label>

        <label className="block mb-5">
          <span className="text-sm font-medium">Confirm New Password</span>
          <input
            type="password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            required
            minLength={6}
            className="mt-1 w-full border dark:border-gray-700 rounded px-3 py-2 focus:outline-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </label>

        <button
          type="submit"
          disabled={loading || !token}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <p className="text-sm text-center mt-4">
          <Link to="/login" className="text-indigo-600 font-medium">Back to Login</Link>
        </p>
      </form>
    </div>
  );
}
