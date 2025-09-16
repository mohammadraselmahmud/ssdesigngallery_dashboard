"use client";
 
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthLayout({ children }) {
  const pathName = usePathname();

  return (
    <main className="flex-center h-dvh w-full bg-gradient-to-br from-[#e8eaeb] to-[#907a69]/30">
      <div className="mx-auto lg:w-1/3 2xl:w-[28%]">
        {/* <div className="mx-auto mb-3 block w-max">
          <Logo size={180} />
        </div> */}

        <div className="w-full rounded-xl border border-primary bg-white/85">
          {children}
        </div>

        {!pathName?.includes("login") && (
          <Link
            href="/login"
            className="flex-center-start group mt-5 gap-x-2 text-sm text-foundation-brown-darker hover:text-primary"
          >
            <ArrowLeft
              size={17}
              className="transition-all duration-300 ease-in-out group-hover:-translate-x-1"
            />{" "}
            Back to login
          </Link>
        )}
      </div>
    </main>
  );
}
