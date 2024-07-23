import { CircleUserRound, Eye, Link as LinkIco } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const DashboardHeader = ({ type }: { type: string }) => {
  return (
    <div className="bg-white-default w-full p-[16px] flex flex-row rounded-[8px] items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <Image src="/devlinks_logo.svg" alt="logo" width={26} height={26} />
        <p className="text-grey-dark text-[20px] font-[700] hidden sm:block">
          devlinks
        </p>
      </div>

      <div className="flex flex-row items-center gap-2">
        <Link
          href="/dashboard/links"
          className={`${
            type === "links"
              ? "text-primary-default bg-primary-disabled"
              : "text-[#888888] bg-white-default"
          } text-[16px] flex flex-row gap-1 items-center justify-center py-[10px] px-[27px] rounded-[8px] font-[500] transition-all duration-300 hover:text-primary-default`}
        >
          <LinkIco size={18} />
          <span className="hidden sm:block">Links</span>
        </Link>

        <Link
          href="/dashboard/profile"
          className={`${
            type === "profile"
              ? "text-primary-default bg-primary-disabled"
              : "text-[#888888] bg-white-default"
          } text-[16px] flex flex-row gap-1 items-center justify-center py-[10px] px-[27px] rounded-[8px] font-[500] transition-all duration-300 hover:text-primary-default`}
        >
          <CircleUserRound size={18} />
          <span className="hidden sm:block">Profile Details</span>
        </Link>
      </div>

      <button className="py-[11px] sm:px-[27px] px-[16px] border-[1px] h-[46px] hover:bg-primary-disabled transition-all duration-300 border-primary-default rounded-[8px] text-primary-default bg-white-default text-[16px]">
        <span className="hidden sm:block">Preview</span>
        <span className="sm:hidden block">
          <Eye size={18} />
        </span>
      </button>
    </div>
  );
};

export default DashboardHeader;
