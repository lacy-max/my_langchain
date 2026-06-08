import { ReactNode } from "react";
import Header from "./header";
import Footer from "./footer";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#ffffff] text-[#f7e7c4] font-serif">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
export default Layout;
