"use client";

import { useMemo, useState } from "react";
import Layout from "@/app/components/layout";
import ApplyPanel from "./components/ApplyPanel";
import CultureSection from "./components/CultureSection";
import JobFilters from "./components/JobFilters";
import JobList from "./components/JobList";
import JobsHero from "./components/JobsHero";
import RoleTiles from "./components/RoleTiles";
import { cultureItems, departments, jobOpenings, locations } from "./data";
import type { JobDepartment, JobLocation } from "./types";

type DepartmentFilter = "全部" | JobDepartment;
type LocationFilter = "全部" | JobLocation;

export default function JobsPage() {
  const [department, setDepartment] = useState<DepartmentFilter>("全部");
  const [location, setLocation] = useState<LocationFilter>("全部");

  const filteredJobs = useMemo(() => {
    return jobOpenings.filter((job) => {
      const matchesDepartment =
        department === "全部" || job.department === department;
      const matchesLocation = location === "全部" || job.location === location;

      return matchesDepartment && matchesLocation;
    });
  }, [department, location]);

  return (
    <Layout>
      <main className="bg-[#fbfaf7] text-[#17120e]">
        <JobsHero />
        <div className="-mt-20">
          <RoleTiles />
        </div>

        <section className="px-8 py-20 md:px-[90px]">
          <div className="mx-auto max-w-[980px] rounded-[8px] border border-white/80 bg-white/76 p-7 shadow-[0_24px_80px_rgba(128,92,43,0.13)] backdrop-blur md:p-10">
            <div className="flex gap-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3e4cf] text-[#b88945]">
                ✦
              </div>
              <div>
                <p className="text-[18px] leading-9 text-[#3a2b1e]">
                  您好，我是萃华招聘顾问。
                </p>
                <p className="mt-1 text-[18px] leading-9 text-[#3a2b1e]">
                  选择你关注的方向与城市，为你呈现当前开放机会。
                </p>
              </div>
            </div>

            <div className="mt-9">
            <JobFilters
              departments={departments}
              locations={locations}
              activeDepartment={department}
              activeLocation={location}
              onDepartmentChange={setDepartment}
              onLocationChange={setLocation}
            />
            </div>

            <div className="mt-10">
              <JobList jobs={filteredJobs} />
            </div>
          </div>
        </section>

        <CultureSection items={cultureItems} />
        <ApplyPanel />
      </main>
    </Layout>
  );
}
