import { Briefcase, MapPin } from "lucide-react";
import type { JobOpening } from "../types";

type JobCardProps = {
  job: JobOpening;
};

function JobCard({ job }: JobCardProps) {
  return (
    <article className="rounded-[8px] border border-[#eadfce] bg-[#fffdf8] p-7 shadow-[0_18px_48px_rgba(128,92,43,0.08)]">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="text-sm tracking-[4px] text-[#9a6a2f]">
            {job.department}
          </p>
          <h3 className="mt-3 text-[27px] font-normal text-[#2a2118]">
            {job.title}
          </h3>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#6b5745]">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {job.type}
            </span>
          </div>
        </div>

        <a
          href={`mailto:hr@cuihua.com?subject=${encodeURIComponent(`应聘${job.title}`)}`}
          className="rounded-full border border-[#d8c7a8] bg-[#faf4eb] px-6 py-3 text-center text-sm tracking-[3px] text-[#7c5425] transition hover:border-[#b88945] hover:bg-white"
        >
          投递简历
        </a>
      </div>

      <p className="mt-6 leading-8 text-[#5f4b3a]">{job.summary}</p>

      <div className="mt-7 grid gap-6 border-t border-[#efe5d7] pt-6 md:grid-cols-2">
        <div>
          <h4 className="text-sm tracking-[3px] text-[#9a6a2f]">职责</h4>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[#6b5745]">
            {job.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm tracking-[3px] text-[#9a6a2f]">期待</h4>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[#6b5745]">
            {job.requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default JobCard;
