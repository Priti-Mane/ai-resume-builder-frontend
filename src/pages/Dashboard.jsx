import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { getJobs } from "../services/api";

const COLORS = ["#6366f1", "#facc15", "#22c55e", "#ef4444"];

export default function Dashboard() {
  const [stats, setStats] = useState({ Applied: 0, Interview: 0, Selected: 0, Rejected: 0 });
  const [total, setTotal] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getJobs();
        const jobs = res.data;
        const counts = { Applied: 0, Interview: 0, Selected: 0, Rejected: 0 };
        jobs.forEach((j) => {
          if (counts[j.status] !== undefined) counts[j.status]++;
        });
        setStats(counts);
        setTotal(jobs.length);

        // Build last-6-months trend data
        const months = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.push({
            key: `${d.getFullYear()}-${d.getMonth()}`,
            label: d.toLocaleString("default", { month: "short" }),
            count: 0,
          });
        }
        jobs.forEach((j) => {
          const d = new Date(j.appliedDate || j.createdAt);
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          const entry = months.find((m) => m.key === key);
          if (entry) entry.count++;
        });
        setMonthlyData(months.map((m) => ({ month: m.label, applications: m.count })));
      } catch {
        // ignore
      }
    })();
  }, []);

  const pieData = [
    { name: "Applied", value: stats.Applied },
    { name: "Interview", value: stats.Interview },
    { name: "Selected", value: stats.Selected },
    { name: "Rejected", value: stats.Rejected },
  ];

  const barData = pieData;

  const successRate = total > 0 ? ((stats.Selected / total) * 100).toFixed(1) : "0.0";

  const cards = [
    { label: "Total Applications", value: total, color: "bg-indigo-100 text-indigo-700" },
    { label: "Interviews", value: stats.Interview, color: "bg-yellow-100 text-yellow-700" },
    { label: "Selected", value: stats.Selected, color: "bg-green-100 text-green-700" },
    { label: "Rejected", value: stats.Rejected, color: "bg-red-100 text-red-700" },
    { label: "Success Rate", value: `${successRate}%`, color: "bg-purple-100 text-purple-700" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-xl p-4 shadow ${c.color}`}>
            <p className="text-sm font-medium">{c.label}</p>
            <p className="text-3xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border dark:border-gray-700">
          <h2 className="font-semibold mb-3">Applications by Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border dark:border-gray-700">
          <h2 className="font-semibold mb-3">Status Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border dark:border-gray-700">
        <h2 className="font-semibold mb-3">Monthly Applications Trend (Last 6 Months)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="applications" stroke="#6366f1" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
