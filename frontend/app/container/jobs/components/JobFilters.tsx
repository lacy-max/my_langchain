import type { JobDepartment, JobLocation } from "../types";

type DepartmentFilter = "全部" | JobDepartment;
type LocationFilter = "全部" | JobLocation;

type JobFiltersProps = {
  departments: DepartmentFilter[];
  locations: LocationFilter[];
  activeDepartment: DepartmentFilter;
  activeLocation: LocationFilter;
  onDepartmentChange: (department: DepartmentFilter) => void;
  onLocationChange: (location: LocationFilter) => void;
};

function JobFilters({
  departments,
  locations,
  activeDepartment,
  activeLocation,
  onDepartmentChange,
  onLocationChange,
}: JobFiltersProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <p className="mb-4 text-sm tracking-[4px] text-[#9a6a2f]">岗位方向</p>
        <div className="flex flex-wrap gap-3">
          {departments.map((department) => (
            <button
              key={department}
              type="button"
              onClick={() => onDepartmentChange(department)}
              className={`rounded-full px-5 py-3 text-sm tracking-[2px] transition ${
                activeDepartment === department
                  ? "bg-[#b88945] text-white shadow-[0_12px_28px_rgba(184,137,69,0.22)]"
                  : "border border-[#e0d3bf] bg-[#fbf7ef] text-[#6b5745] hover:border-[#b88945]"
              }`}
            >
              {department}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-4 text-sm tracking-[4px] text-[#9a6a2f]">城市</p>
        <div className="flex flex-wrap gap-3">
          {locations.map((location) => (
            <button
              key={location}
              type="button"
              onClick={() => onLocationChange(location)}
              className={`rounded-full px-5 py-3 text-sm tracking-[2px] transition ${
                activeLocation === location
                  ? "bg-[#b88945] text-white shadow-[0_12px_28px_rgba(184,137,69,0.22)]"
                  : "border border-[#e0d3bf] bg-[#fbf7ef] text-[#6b5745] hover:border-[#b88945]"
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobFilters;
