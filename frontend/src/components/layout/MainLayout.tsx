import { type ReactNode } from "react";
import Header from "../shared/Header";
import Footer from "../shared/Footer";

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Header />
      <section className="flex-grow flex flex-col gap-4 ">
          {children}
      </section>
      <Footer />
    </div>
  );
}
