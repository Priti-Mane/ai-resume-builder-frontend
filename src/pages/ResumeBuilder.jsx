import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import ResumeForm from "../components/ResumeForm";
import ResumePreview from "../components/ResumePreview";
import { getResume, saveResume } from "../services/api";

const emptyResume = {
  fullName: "",
  email: "",
  phone: "",
  targetRole: "",
  summary: "",
  photo: "",
  template: "classic",
  links: { linkedin: "", github: "", portfolio: "" },
  education: [],
  skills: [],
  experience: [],
  projects: [],
  certifications: [],
};

export default function ResumeBuilder() {
  const [resume, setResume] = useState(emptyResume);
  const [saving, setSaving] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getResume();
        if (res.data) {
          setResume({
            ...emptyResume,
            ...res.data,
            links: { ...emptyResume.links, ...(res.data.links || {}) },
          });
        }
      } catch {
        // No resume yet, ignore
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveResume(resume);
      alert("Resume saved!");
    } catch {
      alert("Failed to save resume.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    const element = previewRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save(`${resume.fullName || "resume"}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Resume Builder</h1>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 sm:flex-none bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
            {saving ? "Saving..." : "Save Resume"}
          </button>
          <button onClick={handleDownloadPDF}
            className="flex-1 sm:flex-none bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResumeForm resume={resume} setResume={setResume} />
        <div className="lg:sticky lg:top-4 lg:self-start">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <h2 className="text-lg font-semibold">Live Preview</h2>
            <label className="text-sm">
              Template:{" "}
              <select
                value={resume.template || "classic"}
                onChange={(e) => setResume({ ...resume, template: e.target.value })}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="classic">Classic</option>
                <option value="modern">Modern (Sidebar)</option>
                <option value="minimal">Minimal</option>
              </select>
            </label>
          </div>
          <div className="overflow-x-auto">
            <ResumePreview resume={resume} ref={previewRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
