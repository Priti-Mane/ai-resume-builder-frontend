import { generateAISummary, generateAISkills, generateAIProjectDesc } from "../services/api";

export default function ResumeForm({ resume, setResume }) {
  const update = (field, value) => setResume({ ...resume, [field]: value });

  const updateArrayItem = (field, index, key, value) => {
    const arr = [...resume[field]];
    arr[index] = { ...arr[index], [key]: value };
    update(field, arr);
  };

  const addArrayItem = (field, template) =>
    update(field, [...resume[field], template]);

  const removeArrayItem = (field, index) =>
    update(field, resume[field].filter((_, i) => i !== index));

  const updateLink = (key, value) =>
    update("links", { ...resume.links, [key]: value });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please choose a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxSize = 300;
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL("image/jpeg", 0.7);
        update("photo", compressed);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleAISummary = async () => {
    try {
      const res = await generateAISummary({
        role: resume.targetRole,
        skills: resume.skills.join(", "),
      });
      update("summary", res.data.summary);
    } catch (err) {
      alert(err.response?.data?.message || "AI summary generation failed. Check backend/API key.");
    }
  };

  const handleAISkills = async () => {
    try {
      const res = await generateAISkills({ role: resume.targetRole });
      const newSkills = res.data.skills || [];
      update("skills", [...new Set([...resume.skills, ...newSkills])]);
    } catch (err) {
      alert(err.response?.data?.message || "AI skill suggestion failed. Check backend/API key.");
    }
  };

  const handleAIProjectDesc = async (index) => {
    try {
      const proj = resume.projects[index];
      const res = await generateAIProjectDesc({ title: proj.title, tech: proj.tech });
      updateArrayItem("projects", index, "description", res.data.description);
    } catch (err) {
      alert(err.response?.data?.message || "AI project description failed. Check backend/API key.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Personal Details */}
      <section className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border dark:border-gray-700">
        <h3 className="font-semibold text-lg mb-3 text-indigo-600">Personal Details</h3>

        <div className="flex items-center gap-4 mb-3">
          {resume.photo ? (
            <img src={resume.photo} alt="Profile" className="w-16 h-16 rounded-full object-cover border dark:border-gray-700" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
              Photo
            </div>
          )}
          <div>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-sm" />
            {resume.photo && (
              <button onClick={() => update("photo", "")} className="text-red-500 text-xs ml-2">Remove</button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Full Name"
            value={resume.fullName} onChange={(e) => update("fullName", e.target.value)} />
          <input className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Email"
            value={resume.email} onChange={(e) => update("email", e.target.value)} />
          <input className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Phone"
            value={resume.phone} onChange={(e) => update("phone", e.target.value)} />
          <input className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Target Role (e.g. React Developer)"
            value={resume.targetRole} onChange={(e) => update("targetRole", e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <input className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="LinkedIn URL"
            value={resume.links?.linkedin || ""} onChange={(e) => updateLink("linkedin", e.target.value)} />
          <input className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="GitHub URL"
            value={resume.links?.github || ""} onChange={(e) => updateLink("github", e.target.value)} />
          <input className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Portfolio URL"
            value={resume.links?.portfolio || ""} onChange={(e) => updateLink("portfolio", e.target.value)} />
        </div>
      </section>

      {/* AI Summary */}
      <section className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border dark:border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg text-indigo-600">Professional Summary</h3>
          <button onClick={handleAISummary} className="bg-purple-600 text-white text-sm px-3 py-1 rounded hover:bg-purple-700">
            ✨ AI Generate
          </button>
        </div>
        <textarea className="w-full border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" rows={4}
          value={resume.summary} onChange={(e) => update("summary", e.target.value)} />
      </section>

      {/* Education */}
      <section className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border dark:border-gray-700">
        <h3 className="font-semibold text-lg mb-3 text-indigo-600">Education</h3>
        {resume.education.map((edu, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
            <input className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Degree"
              value={edu.degree} onChange={(e) => updateArrayItem("education", i, "degree", e.target.value)} />
            <input className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Institute"
              value={edu.institute} onChange={(e) => updateArrayItem("education", i, "institute", e.target.value)} />
            <input className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Year"
              value={edu.year} onChange={(e) => updateArrayItem("education", i, "year", e.target.value)} />
            <button onClick={() => removeArrayItem("education", i)} className="text-red-500 text-sm">Remove</button>
          </div>
        ))}
        <button onClick={() => addArrayItem("education", { degree: "", institute: "", year: "" })}
          className="text-indigo-600 text-sm font-medium mt-2">+ Add Education</button>
      </section>

      {/* Skills */}
      <section className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border dark:border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg text-indigo-600">Skills</h3>
          <button onClick={handleAISkills} className="bg-purple-600 text-white text-sm px-3 py-1 rounded hover:bg-purple-700">
            ✨ AI Suggest Skills
          </button>
        </div>
        <input className="w-full border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Comma separated: React, Node.js, MongoDB"
          value={resume.skills.join(", ")}
          onChange={(e) => update("skills", e.target.value.split(",").map((s) => s.trim()))} />
      </section>

      {/* Experience */}
      <section className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border dark:border-gray-700">
        <h3 className="font-semibold text-lg mb-3 text-indigo-600">Experience</h3>
        {resume.experience.map((exp, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
            <input className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Company"
              value={exp.company} onChange={(e) => updateArrayItem("experience", i, "company", e.target.value)} />
            <input className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Role"
              value={exp.role} onChange={(e) => updateArrayItem("experience", i, "role", e.target.value)} />
            <input className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Duration"
              value={exp.duration} onChange={(e) => updateArrayItem("experience", i, "duration", e.target.value)} />
            <button onClick={() => removeArrayItem("experience", i)} className="text-red-500 text-sm">Remove</button>
            <textarea className="border dark:border-gray-700 rounded px-3 py-2 md:col-span-4 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Description"
              value={exp.description} onChange={(e) => updateArrayItem("experience", i, "description", e.target.value)} />
          </div>
        ))}
        <button onClick={() => addArrayItem("experience", { company: "", role: "", duration: "", description: "" })}
          className="text-indigo-600 text-sm font-medium mt-2">+ Add Experience</button>
      </section>

      {/* Projects */}
      <section className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border dark:border-gray-700">
        <h3 className="font-semibold text-lg mb-3 text-indigo-600">Projects</h3>
        {resume.projects.map((proj, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
            <input className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Project Title"
              value={proj.title} onChange={(e) => updateArrayItem("projects", i, "title", e.target.value)} />
            <input className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Tech Stack"
              value={proj.tech} onChange={(e) => updateArrayItem("projects", i, "tech", e.target.value)} />
            <button onClick={() => handleAIProjectDesc(i)} className="bg-purple-600 text-white text-sm px-3 py-1 rounded hover:bg-purple-700">
              ✨ AI Description
            </button>
            <button onClick={() => removeArrayItem("projects", i)} className="text-red-500 text-sm">Remove</button>
            <textarea className="border dark:border-gray-700 rounded px-3 py-2 md:col-span-4 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Description"
              value={proj.description} onChange={(e) => updateArrayItem("projects", i, "description", e.target.value)} />
          </div>
        ))}
        <button onClick={() => addArrayItem("projects", { title: "", tech: "", description: "" })}
          className="text-indigo-600 text-sm font-medium mt-2">+ Add Project</button>
      </section>

      {/* Certifications */}
      <section className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border dark:border-gray-700">
        <h3 className="font-semibold text-lg mb-3 text-indigo-600">Certifications & Achievements</h3>
        {resume.certifications?.map((cert, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
            <input className="border dark:border-gray-700 rounded px-3 py-2 md:col-span-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Title (e.g. AWS Certified Developer)"
              value={cert.title} onChange={(e) => updateArrayItem("certifications", i, "title", e.target.value)} />
            <input className="border dark:border-gray-700 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" placeholder="Issuer / Year"
              value={cert.issuer} onChange={(e) => updateArrayItem("certifications", i, "issuer", e.target.value)} />
            <button onClick={() => removeArrayItem("certifications", i)} className="text-red-500 text-sm">Remove</button>
          </div>
        ))}
        <button onClick={() => addArrayItem("certifications", { title: "", issuer: "" })}
          className="text-indigo-600 text-sm font-medium mt-2">+ Add Certification</button>
      </section>
    </div>
  );
}
