import type { JobDepartment, JobLocation, JobOpening } from "./types";

export const departments: Array<"全部" | JobDepartment> = [
  "全部",
  "门店运营",
  "产品与工艺",
  "品牌零售",
];

export const locations: Array<"全部" | JobLocation> = [
  "全部",
  "沈阳",
  "大连",
  "北京",
  "上海",
];

export const jobOpenings: JobOpening[] = [
  {
    id: 1,
    title: "珠宝顾问",
    department: "门店运营",
    location: "沈阳",
    type: "全职",
    summary: "在门店接待顾客，完成珠宝试戴、选购建议与长期客情维护。",
    responsibilities: [
      "理解顾客需求，提供珠宝搭配、婚嫁甄选与礼赠建议。",
      "维护门店陈列、商品状态与日常服务秩序。",
      "沉淀顾客偏好，协同完成复购、保养与会员服务。",
    ],
    requirements: [
      "具备零售、奢侈品、珠宝或高客单服务经验优先。",
      "表达稳妥，审美在线，愿意长期经营顾客关系。",
    ],
  },
  {
    id: 2,
    title: "门店店长",
    department: "门店运营",
    location: "大连",
    type: "全职",
    summary: "负责门店经营目标、团队管理、服务标准与顾客体验落地。",
    responsibilities: [
      "制定门店销售计划，跟进目标达成与经营复盘。",
      "培养顾问团队，建立稳定的服务流程与陈列标准。",
      "处理重点顾客接待、售后协调与门店日常运营。",
    ],
    requirements: [
      "三年以上零售门店管理经验，有珠宝行业经验优先。",
      "具备团队带教、数据复盘与现场经营判断能力。",
    ],
  },
  {
    id: 3,
    title: "珠宝产品企划",
    department: "产品与工艺",
    location: "上海",
    type: "全职",
    summary: "参与产品系列规划、市场趋势研究与新品卖点梳理。",
    responsibilities: [
      "完成竞品、趋势、用户场景与销售数据分析。",
      "协同设计、供应链和零售团队推进产品企划。",
      "输出系列主题、产品故事、培训素材与上市节奏建议。",
    ],
    requirements: [
      "熟悉珠宝、服饰、美学消费或生活方式行业。",
      "具备清晰的结构化表达能力与审美判断。",
    ],
  },
  {
    id: 4,
    title: "品牌内容策划",
    department: "品牌零售",
    location: "北京",
    type: "全职",
    summary: "负责品牌内容、活动主题、门店物料与线上传播文案。",
    responsibilities: [
      "策划新品、节庆、婚嫁等主题内容与传播脚本。",
      "协同视觉团队完成页面、海报、短内容与门店话术。",
      "维护品牌语气，提升内容质感与销售转化承接。",
    ],
    requirements: [
      "有品牌策划、文案、零售内容或新媒体经验。",
      "文字克制，有审美敏感度，能把卖点写得有分寸。",
    ],
  },
];

export const cultureItems = [
  {
    title: "懂美，也懂人",
    desc: "我们重视审美判断，也重视人与人之间的体面沟通。",
  },
  {
    title: "稳妥胜过喧哗",
    desc: "珠宝行业需要耐心。把细节做准，把承诺守住。",
  },
  {
    title: "长期主义",
    desc: "从顾客关系到个人成长，我们更相信可持续的积累。",
  },
];

