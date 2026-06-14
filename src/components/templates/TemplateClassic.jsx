export default function TemplateClassic({ resume }) {
  return (
    <div className="text-left text-gray-800">
      <div className="flex items-center gap-4 mb-1">
        {resume.photo && (
          <img src={resume.photo} alt="Profile" className="w-16 h-16 rounded-full object-cover border flex-shrink-0" />
        )}
        <div>
          <h1 className="text-3xl font-bold text-indigo-700">{resume.fullName || "Your Name"}</h1>
          <p className="text-sm text-gray-600">{resume.email} {resume.phone && `| ${resume.phone}`}</p>
        </div>
      </div>

      {(resume.links?.linkedin || resume.links?.github || resume.links?.portfolio) ? (
        <p className="text-xs text-indigo-600 mb-4 flex flex-wrap gap-3">
          {resume.links.linkedin && <a href={resume.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
          {resume.links.github && <a href={resume.links.github} target="_blank" rel="noreferrer">GitHub</a>}
          {resume.links.portfolio && <a href={resume.links.portfolio} target="_blank" rel="noreferrer">Portfolio</a>}
        </p>
      ) : (
        <div className="mb-4" />
      )}

      {resume.summary && (
        <div className="mb-4">
          <h2 className="font-bold border-b mb-1">Professional Summary</h2>
          <p className="text-sm">{resume.summary}</p>
        </div>
      )}

      {resume.skills?.length > 0 && resume.skills[0] && (
        <div className="mb-4">
          <h2 className="font-bold border-b mb-1">Skills</h2>
          <p className="text-sm">{resume.skills.join(", ")}</p>
        </div>
      )}

      {resume.experience?.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold border-b mb-1">Experience</h2>
          {resume.experience.map((exp, i) => (
            <div key={i} className="mb-2 text-sm">
              <p className="font-semibold">{exp.role} - {exp.company} ({exp.duration})</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {resume.projects?.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold border-b mb-1">Projects</h2>
          {resume.projects.map((proj, i) => (
            <div key={i} className="mb-2 text-sm">
              <p className="font-semibold">{proj.title} ({proj.tech})</p>
              <p>{proj.description}</p>
            </div>
          ))}
        </div>
      )}

      {resume.education?.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold border-b mb-1">Education</h2>
          {resume.education.map((edu, i) => (
            <p key={i} className="text-sm">{edu.degree} - {edu.institute} ({edu.year})</p>
          ))}
        </div>
      )}

      {resume.certifications?.length > 0 && resume.certifications.some((c) => c.title) && (
        <div className="mb-4">
          <h2 className="font-bold border-b mb-1">Certifications & Achievements</h2>
          {resume.certifications.map((cert, i) => (
            cert.title && (
              <p key={i} className="text-sm">
                {cert.title}{cert.issuer && ` - ${cert.issuer}`}
              </p>
            )
          ))}
        </div>
      )}
    </div>
  );
}
