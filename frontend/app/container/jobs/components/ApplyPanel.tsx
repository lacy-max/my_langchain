import { Mail, Phone } from "lucide-react";

function ApplyPanel() {
  return (
    <section className="px-8 pb-24 md:px-[90px]">
      <div className="mx-auto grid max-w-[1120px] gap-10 rounded-[8px] border border-white/80 bg-white/72 p-8 shadow-[0_22px_70px_rgba(128,92,43,0.12)] backdrop-blur md:grid-cols-[1fr_0.85fr] md:p-12">
        <div>
          <p className="text-sm uppercase tracking-[6px] text-[#9a6a2f]">
            APPLICATION
          </p>
          <h2 className="mt-5 text-[38px] font-normal leading-tight text-[#1d1510]">
            期待与你相见。
          </h2>
          <p className="mt-6 text-[17px] leading-9 text-[#5d4a39]">
            请将简历与作品集发送至招聘邮箱。若你关注的岗位暂未开放，也欢迎留下资料，我们会在合适机会与你联系。
          </p>
        </div>

        <div className="grid content-center gap-5 text-[#2a2119]">
          <a
            href="mailto:hr@cuihua.com"
            className="flex items-center gap-4 rounded-full border border-[#e0d3bf] bg-[#fbf7ef] px-6 py-5 transition hover:border-[#b88945] hover:bg-white"
          >
            <Mail className="h-5 w-5 text-[#9a6a2f]" />
            <span>hr@cuihua.com</span>
          </a>
          <a
            href="tel:024-00000000"
            className="flex items-center gap-4 rounded-full border border-[#e0d3bf] bg-[#fbf7ef] px-6 py-5 transition hover:border-[#b88945] hover:bg-white"
          >
            <Phone className="h-5 w-5 text-[#9a6a2f]" />
            <span>024-00000000</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default ApplyPanel;
