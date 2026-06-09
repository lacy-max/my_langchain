export type JobDepartment = "门店运营" | "产品与工艺" | "品牌零售";

export type JobLocation = "沈阳" | "大连" | "北京" | "上海";

export type JobOpening = {
  id: number;
  title: string;
  department: JobDepartment;
  location: JobLocation;
  type: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

