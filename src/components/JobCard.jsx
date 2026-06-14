const statusColors = {
  Applied: "bg-blue-100 text-blue-700",
  Interview: "bg-yellow-100 text-yellow-700",
  Selected: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function JobCard({ job, onUpdateStatus, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4 shadow flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{job.position}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded ${statusColors[job.status]}`}>
          {job.status}
        </span>
      </div>

      {job.notes && <p className="text-sm text-gray-700 dark:text-gray-300">{job.notes}</p>}

      {job.followUpDate && (
        <p className="text-xs text-indigo-600 font-medium">
          📅 Follow-up: {new Date(job.followUpDate).toLocaleDateString()}
        </p>
      )}

      <div className="flex justify-between items-center mt-2">
        <select
          value={job.status}
          onChange={(e) => onUpdateStatus(job._id, e.target.value)}
          className="border dark:border-gray-700 rounded px-2 py-1 text-sm"
        >
          <option>Applied</option>
          <option>Interview</option>
          <option>Selected</option>
          <option>Rejected</option>
        </select>
        <button onClick={() => onDelete(job._id)} className="text-red-500 text-sm font-medium">
          Delete
        </button>
      </div>
    </div>
  );
}
