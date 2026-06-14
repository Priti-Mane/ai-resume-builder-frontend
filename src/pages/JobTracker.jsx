import { useState, useEffect } from "react";
import { getJobs, addJob, updateJob, deleteJob } from "../services/api";
import JobCard from "../components/JobCard";

export default function JobTracker() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ company: "", position: "", status: "Applied", notes: "", followUpDate: "" });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchJobs = async () => {
    try {
      const res = await getJobs();
      setJobs(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.company || !form.position) return;
    try {
      const res = await addJob(form);
      setJobs([res.data, ...jobs]);
      setForm({ company: "", position: "", status: "Applied", notes: "", followUpDate: "" });
    } catch {
      alert("Failed to add job.");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await updateJob(id, { status });
      setJobs(jobs.map((j) => (j._id === id ? res.data : j)));
    } catch {
      alert("Failed to update job.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJob(id);
      setJobs(jobs.filter((j) => j._id !== id));
    } catch {
      alert("Failed to delete job.");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.position.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Job Tracker</h1>

      <form onSubmit={handleAdd} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border dark:border-gray-700 grid grid-cols-1 md:grid-cols-6 gap-2 mb-4">
        <input name="company" value={form.company} onChange={handleChange} placeholder="Company Name"
          className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required />
        <input name="position" value={form.position} onChange={handleChange} placeholder="Position"
          className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required />
        <select name="status" value={form.status} onChange={handleChange} className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
          <option>Applied</option>
          <option>Interview</option>
          <option>Selected</option>
          <option>Rejected</option>
        </select>
        <input name="notes" value={form.notes} onChange={handleChange} placeholder="Notes"
          className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
        <input type="date" name="followUpDate" value={form.followUpDate} onChange={handleChange}
          title="Follow-up / Interview date" className="border dark:border-gray-700 rounded px-3 py-2 text-gray-600 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
        <button type="submit" className="bg-indigo-600 text-white rounded px-3 py-2 hover:bg-indigo-700">
          Add Job
        </button>
      </form>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by company or position..."
          className="border dark:border-gray-700 rounded px-3 py-2 flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
          <option value="All">All Status</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Selected</option>
          <option>Rejected</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredJobs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          {jobs.length === 0 ? "No jobs added yet." : "No jobs match your search/filter."}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <JobCard key={job._id} job={job} onUpdateStatus={handleUpdateStatus} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
