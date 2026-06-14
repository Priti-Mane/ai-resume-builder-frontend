import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyEmail, getProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const { login, token: authToken, user } = useAuth();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    (async () => {
      try {
        const res = await verifyEmail(token);
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully!");

        // If logged in, refresh the user's verification status
        if (authToken && user) {
          try {
            const profileRes = await getProfile();
            login({ id: profileRes.data.id, name: profileRes.data.name, email: profileRes.data.email, isVerified: profileRes.data.isVerified }, authToken);
          } catch {
            // ignore
          }
        }
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md border dark:border-gray-700 text-center">
        {status === "loading" && (
          <p className="text-gray-600 dark:text-gray-300">Verifying your email...</p>
        )}
        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-2">✅ Verified!</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{message}</p>
          </>
        )}
        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{message}</p>
          </>
        )}
        <Link to="/dashboard" className="text-indigo-600 font-medium">Go to Dashboard</Link>
      </div>
    </div>
  );
}
