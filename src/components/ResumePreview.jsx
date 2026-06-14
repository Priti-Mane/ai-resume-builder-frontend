import { forwardRef } from "react";
import TemplateClassic from "./templates/TemplateClassic";
import TemplateModern from "./templates/TemplateModern";
import TemplateMinimal from "./templates/TemplateMinimal";

const templates = {
  classic: TemplateClassic,
  modern: TemplateModern,
  minimal: TemplateMinimal,
};

const ResumePreview = forwardRef(({ resume }, ref) => {
  const Template = templates[resume.template] || TemplateClassic;

  return (
    <div ref={ref} className="bg-white p-4 sm:p-8 shadow border rounded-xl w-full min-w-[320px] max-w-3xl mx-auto">
      <Template resume={resume} />
    </div>
  );
});

export default ResumePreview;
