export default function TemplateMinimal({ resume }) {
  return (
    <div className="text-left text-gray-800 font-light">
      <div className="text-center mb-4 pb-3 border-b-2 border-gray-300">
        {resume.photo && (
          <img src={resume.photo} alt="Profile" className="w-16 h-16 rounded-full object-cover border mx-auto mb-2" />
        )}
        <h1 className="text-2xl font-semibold tracking-wide uppercase">{resume.fullName || "Your Name"}</h1>
        <p className="text-xs text-gray-500 mt-1">
          {[resume.email, resume.phone, resume.targetRole].filter(Boolean).join("  •  ")}
        </p>
        {(resume.links?.linkedin || resume.links?.github || resume.links?.portfolio) && (
          <p className="text-xs text-gray-500 mt-1 flex justify-center gap-3">
            {resume.links.linkedin && <a href={resume.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
            {resume.links.github && <a href={resume.links.github} target="_blank" rel="noreferrer">GitHub</a>}
            {resume.links.portfolio && <a href={resume.links.portfolio} target="_blank" rel="noreferrer">Portfolio</a>}
          </p>
        )}
      </div>

      {resume.summary && (
        <div className="mb-4 text-center">
          <p className="text-sm italic text-gray-700">{resume.summary}</p>
        </div>
      )}

      {resume.skills?.length > 0 && resume.skills[0] && (
        <div className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">Skills</h2>
          <p className="text-sm">{resume.skills.join(" · ")}</p>
        </div>
      )}

      {resume.experience?.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">Experience</h2>
          {resume.experience.map((exp, i) => (
            <div key={i} className="mb-2 text-sm">
              <p className="font-medium">{exp.role}, {exp.company} <span className="text-gray-400">({exp.duration})</span></p>
              <p className="text-gray-700">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {resume.projects?.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">Projects</h2>
          {resume.projects.map((proj, i) => (
            <div key={i} className="mb-2 text-sm">
              <p className="font-medium">{proj.title} <span className="text-gray-400">({proj.tech})</span></p>
              <p className="text-gray-700">{proj.description}</p>
            </div>
          ))}
        </div>
      )}

      {resume.education?.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">Education</h2>
          {resume.education.map((edu, i) => (
            <p key={i} className="text-sm">{edu.degree}, {edu.institute} <span className="text-gray-400">({edu.year})</span></p>
          ))}
        </div>
      )}

      {resume.certifications?.length > 0 && resume.certifications.some((c) => c.title) && (
        <div className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">Certifications</h2>
          {resume.certifications.map((cert, i) => (
            cert.title && <p key={i} className="text-sm">{cert.title}{cert.issuer && `, ${cert.issuer}`}</p>
          ))}
        </div>
      )}
    </div>
  );
}
