import type { JobOpening } from "../types";
import JobCard from "./JobCard";

type JobListProps = {
  jobs: JobOpening[];
};

function JobList({ jobs }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="border border-[#e3d5bd] bg-white py-20 text-center text-[#6b5745]">
        暂无匹配岗位
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

export default JobList;
