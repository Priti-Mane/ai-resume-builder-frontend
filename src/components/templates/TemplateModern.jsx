export default function TemplateModern({ resume }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 text-gray-800 -m-4 sm:-m-8 overflow-hidden rounded-xl">
      {/* Sidebar */}
      <div className="bg-indigo-700 text-white p-5 sm:col-span-1">
        {resume.photo && (
          <img src={resume.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-white mb-3" />
        )}
        <h1 className="text-xl font-bold mb-1">{resume.fullName || "Your Name"}</h1>
        <p className="text-xs opacity-80 mb-4">{resume.targetRole}</p>

        <div className="text-xs space-y-1 mb-4">
          {resume.email && <p>{resume.email}</p>}
          {resume.phone && <p>{resume.phone}</p>}
        </div>

        {(resume.links?.linkedin || resume.links?.github || resume.links?.portfolio) && (
          <div className="text-xs space-y-1 mb-4">
            {resume.links.linkedin && <p><a href={resume.links.linkedin} target="_blank" rel="noreferrer" className="underline">LinkedIn</a></p>}
            {resume.links.github && <p><a href={resume.links.github} target="_blank" rel="noreferrer" className="underline">GitHub</a></p>}
            {resume.links.portfolio && <p><a href={resume.links.portfolio} target="_blank" rel="noreferrer" className="underline">Portfolio</a></p>}
          </div>
        )}

        {resume.skills?.length > 0 && resume.skills[0] && (
          <div className="mb-4">
            <h2 className="font-bold text-sm uppercase tracking-wide mb-1 border-b border-indigo-400 pb-1">Skills</h2>
            <ul className="text-xs space-y-1 mt-2">
              {resume.skills.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}

        {resume.education?.length > 0 && (
          <div className="mb-4">
            <h2 className="font-bold text-sm uppercase tracking-wide mb-1 border-b border-indigo-400 pb-1">Education</h2>
            {resume.education.map((edu, i) => (
              <p key={i} className="text-xs mt-2">{edu.degree}<br />{edu.institute} ({edu.year})</p>
            ))}
          </div>
        )}

        {resume.certifications?.length > 0 && resume.certifications.some((c) => c.title) && (
          <div className="mb-4">
            <h2 className="font-bold text-sm uppercase tracking-wide mb-1 border-b border-indigo-400 pb-1">Certifications</h2>
            {resume.certifications.map((cert, i) => (
              cert.title && <p key={i} className="text-xs mt-2">{cert.title}{cert.issuer && ` - ${cert.issuer}`}</p>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="p-5 sm:col-span-2 bg-white">
        {resume.summary && (
          <div className="mb-4">
            <h2 className="font-bold text-indigo-700 uppercase tracking-wide text-sm mb-1 border-b pb-1">Profile</h2>
            <p className="text-sm mt-2">{resume.summary}</p>
          </div>
        )}

        {resume.experience?.length > 0 && (
          <div className="mb-4">
            <h2 className="font-bold text-indigo-700 uppercase tracking-wide text-sm mb-1 border-b pb-1">Experience</h2>
            {resume.experience.map((exp, i) => (
              <div key={i} className="mb-2 text-sm mt-2">
                <p className="font-semibold">{exp.role} - {exp.company} ({exp.duration})</p>
                <p>{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {resume.projects?.length > 0 && (
          <div className="mb-4">
            <h2 className="font-bold text-indigo-700 uppercase tracking-wide text-sm mb-1 border-b pb-1">Projects</h2>
            {resume.projects.map((proj, i) => (
              <div key={i} className="mb-2 text-sm mt-2">
                <p className="font-semibold">{proj.title} ({proj.tech})</p>
                <p>{proj.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
