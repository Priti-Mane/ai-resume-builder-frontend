import { useState } from "react";
import { updateProfile, changePassword } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { passwordsMatch } from "../utils/validators";

export default function Settings() {
  const { user, login, token } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passMsg, setPassMsg] = useState("");
  const [passErr, setPassErr] = useState("");
  const [savingPass, setSavingPass] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileErr("");
    setSavingProfile(true);
    try {
      const res = await updateProfile({ name });
      login({ id: res.data.id, name: res.data.name, email: res.data.email }, token);
      setProfileMsg("Profile updated successfully.");
    } catch (err) {
      setProfileErr(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassMsg("");
    setPassErr("");

    if (!passwordsMatch(passwords.newPassword, passwords.confirmPassword)) {
      setPassErr("New password and confirm password do not match.");
      return;
    }

    setSavingPass(true);
    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPassMsg("Password updated successfully.");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPassErr(err.response?.data?.message || "Failed to update password.");
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile */}
      <section className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border dark:border-gray-700">
        <h2 className="font-semibold text-lg mb-3 text-indigo-600">Profile</h2>
        <form onSubmit={handleProfileSave} className="space-y-3">
          {profileMsg && <p className="bg-green-100 text-green-700 text-sm p-2 rounded">{profileMsg}</p>}
          {profileErr && <p className="bg-red-100 text-red-600 text-sm p-2 rounded">{profileErr}</p>}

          <label className="block">
            <span className="text-sm font-medium">Full Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="mt-1 w-full border dark:border-gray-700 rounded px-3 py-2 bg-gray-100 text-gray-500 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600"
            />
          </label>

          <button type="submit" disabled={savingProfile}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
            {savingProfile ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </section>

      {/* Change Password */}
      <section className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border dark:border-gray-700">
        <h2 className="font-semibold text-lg mb-3 text-indigo-600">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-3">
          {passMsg && <p className="bg-green-100 text-green-700 text-sm p-2 rounded">{passMsg}</p>}
          {passErr && <p className="bg-red-100 text-red-600 text-sm p-2 rounded">{passErr}</p>}

          <label className="block">
            <span className="text-sm font-medium">Current Password</span>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              required
              className="mt-1 w-full border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">New Password</span>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              required
              minLength={6}
              className="mt-1 w-full border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Confirm New Password</span>
            <input
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              required
              minLength={6}
              className="mt-1 w-full border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </label>

          <button type="submit" disabled={savingPass}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
            {savingPass ? "Updating..." : "Update Password"}
          </button>
        </form>
      </section>
    </div>
  );
}
