"use client";

import DashboardHeader from "@/components/DashboardHeader";
import { ArrowRight, Plus } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type LinkProps = {
  name: string;
  link: string;
};
const Links = () => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const links = JSON.parse(sessionStorage.getItem("links") || "[]");
    setLinks(links);
  }, []);
  return (
    <div className="font-default sm:p-[16px] p-0 flex flex-col gap-10 h-full">
      <DashboardHeader type={"links"} />

      <div className="flex flex-row gap-10 ">
        <div className="h-[815px] w-[40%] bg-white-default rounded-[12px] p-[40px] relative mb-[16px] flex justify-center items-center">
          <Image
            src={"/preview-section.svg"}
            width={307}
            height={631}
            className="absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]"
            alt=""
          />

          <div className="flex flex-col justify-start items-center gap-[20px] mt-[102px] h-[180px] overflow-hidden">
            {links.length &&
              links.map((link: LinkProps, index: number) => {
                return (
                  <button
                    key={index}
                    className={`${
                      link.name === "github"
                        ? "bg-black"
                        : link.name === "youtube"
                        ? "bg-red"
                        : "bg-[#2D68FF]"
                    } text-white-default w-[237px] h-[44px] z-50 relative flex flex-row rounded-[8px] items-center py-[11px] px-[16px] gap-[8px] justify-between`}
                  >
                    <span className="flex flex-row items-center gap-[8px]">
                      {link.name === "github" ? (
                        <svg
                          width="13"
                          height="15"
                          viewBox="0 0 13 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.98187 1.28805C7.67799 0.985074 6.32201 0.985074 5.01813 1.28805C4.26507 0.826185 3.69013 0.613919 3.272 0.524319C3.09354 0.484042 2.91093 0.465065 2.728 0.467785C2.64476 0.470041 2.56192 0.48004 2.48053 0.497652L2.46987 0.499785L2.4656 0.501919H2.4624L2.60853 1.01499L2.4624 0.502985C2.38746 0.524162 2.31807 0.561492 2.2591 0.612353C2.20013 0.663213 2.15302 0.72637 2.12107 0.797385C1.80637 1.50214 1.74642 2.29436 1.95147 3.03845C1.42041 3.68203 1.13101 4.49099 1.13333 5.32539C1.13333 6.98192 1.62187 8.09552 2.45493 8.81125C3.0384 9.31259 3.74667 9.57925 4.45707 9.73179C4.34527 10.0601 4.30313 10.4081 4.33333 10.7537V11.3915C3.8992 11.4822 3.5984 11.4534 3.384 11.383C3.11627 11.2945 2.9104 11.1163 2.71307 10.8603C2.60991 10.7223 2.51379 10.5792 2.42507 10.4315L2.36427 10.3323C2.28749 10.2047 2.20783 10.0788 2.12533 9.95472C1.92267 9.65499 1.62187 9.27952 1.13547 9.15152L0.6192 9.01605L0.348267 10.0486L0.864533 10.1841C0.949867 10.2054 1.0608 10.2854 1.2432 10.5531C1.31341 10.6588 1.38098 10.7662 1.44587 10.8753L1.5184 10.9926C1.61867 11.1547 1.73387 11.3339 1.8672 11.5089C2.13707 11.8609 2.50507 12.2161 3.0512 12.3963C3.42453 12.5201 3.84907 12.5499 4.33333 12.4753V14.4667C4.33333 14.6082 4.38952 14.7438 4.48954 14.8438C4.58956 14.9439 4.72522 15.0001 4.86667 15.0001H9.13333C9.27478 15.0001 9.41044 14.9439 9.51046 14.8438C9.61048 14.7438 9.66667 14.6082 9.66667 14.4667V10.6662C9.66667 10.3302 9.65173 10.0219 9.5568 9.73499C10.264 9.58565 10.9669 9.31899 11.5472 8.81765C12.3792 8.09659 12.8667 6.97232 12.8667 5.30619V5.30512C12.864 4.47756 12.5745 3.67652 12.0475 3.03845C12.2523 2.2947 12.1923 1.50289 11.8779 0.798452C11.8462 0.727352 11.7993 0.664058 11.7405 0.613014C11.6817 0.561971 11.6124 0.524415 11.5376 0.502985L11.3915 1.01499C11.5376 0.502985 11.5365 0.502985 11.5355 0.502985L11.5333 0.501919L11.5291 0.499785L11.5195 0.497652C11.4931 0.490802 11.4664 0.48546 11.4395 0.481652C11.3836 0.473499 11.3273 0.468868 11.2709 0.467785C11.088 0.465085 10.9054 0.484061 10.7269 0.524319C10.3099 0.613919 9.73493 0.826185 8.98187 1.28805Z"
                            fill="white"
                          />
                        </svg>
                      ) : link.name === "youtube" ? (
                        <svg
                          width="15"
                          height="11"
                          viewBox="0 0 15 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.53771 0.166626C7.89371 0.168626 8.78437 0.177293 9.73104 0.215293L10.067 0.229959C11.0197 0.274626 11.9717 0.351959 12.4444 0.483293C13.0744 0.660626 13.569 1.17663 13.7364 1.83129C14.003 2.87129 14.0364 4.89929 14.0404 5.39063L14.041 5.49196V5.60796C14.0364 6.09929 14.003 8.12796 13.7364 9.16729C13.567 9.82396 13.0717 10.3406 12.4444 10.5153C11.9717 10.6466 11.0197 10.724 10.067 10.7686L9.73104 10.784C8.78437 10.8213 7.89371 10.8306 7.53771 10.832L7.38104 10.8326H7.21104C6.45771 10.828 3.30704 10.794 2.30437 10.5153C1.67504 10.338 1.17971 9.82196 1.01237 9.16729C0.745707 8.12729 0.712374 6.09929 0.708374 5.60796V5.39063C0.712374 4.89929 0.745707 2.87063 1.01237 1.83129C1.18171 1.17463 1.67704 0.657959 2.30504 0.483959C3.30704 0.204626 6.45837 0.170626 7.21171 0.166626H7.53771ZM6.04104 3.16663V7.83329L10.041 5.49996L6.04104 3.16663Z"
                            fill="white"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 13 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.0417 0.5C11.3953 0.5 11.7344 0.640476 11.9845 0.890524C12.2345 1.14057 12.375 1.47971 12.375 1.83333V11.1667C12.375 11.5203 12.2345 11.8594 11.9845 12.1095C11.7344 12.3595 11.3953 12.5 11.0417 12.5H1.70833C1.35471 12.5 1.01557 12.3595 0.765524 12.1095C0.515476 11.8594 0.375 11.5203 0.375 11.1667V1.83333C0.375 1.47971 0.515476 1.14057 0.765524 0.890524C1.01557 0.640476 1.35471 0.5 1.70833 0.5H11.0417ZM10.7083 10.8333V7.3C10.7083 6.7236 10.4794 6.1708 10.0718 5.76322C9.6642 5.35564 9.1114 5.12667 8.535 5.12667C7.96833 5.12667 7.30833 5.47333 6.98833 5.99333V5.25333H5.12833V10.8333H6.98833V7.54667C6.98833 7.03333 7.40167 6.61333 7.915 6.61333C8.16254 6.61333 8.39993 6.71167 8.57497 6.8867C8.75 7.06173 8.84833 7.29913 8.84833 7.54667V10.8333H10.7083ZM2.96167 4.20667C3.25871 4.20667 3.54359 4.08867 3.75363 3.87863C3.96367 3.66859 4.08167 3.38371 4.08167 3.08667C4.08167 2.46667 3.58167 1.96 2.96167 1.96C2.66286 1.96 2.37628 2.0787 2.16499 2.28999C1.9537 2.50128 1.835 2.78786 1.835 3.08667C1.835 3.70667 2.34167 4.20667 2.96167 4.20667ZM3.88833 10.8333V5.25333H2.04167V10.8333H3.88833Z"
                            fill="white"
                          />
                        </svg>
                      )}
                      <span className="capitalize">{link.name}</span>
                    </span>
                    <ArrowRight size={18} />
                  </button>
                );
              })}
          </div>
        </div>
        <div className="h-[815px] w-[60%] bg-white-default rounded-[12px] pt-[40px] flex flex-col gap-[40px]">
          <div className="px-[40px]">
            <h1 className="text-[32px] font-[700] text-grey-dark mb-1">
              Customize your links
            </h1>

            <p className="text-grey-medium text-[16px]">
              Add/edit/remove links below and then share all your profiles with
              the world!
            </p>
          </div>

          <div className="px-[40px]">
            <button className="text-primary-default border-[1px] hover:bg-primary-disabled transition-all duration-300 border-primary-default rounded-[8px] flex flex-row w-full items-center justify-center py-[11px] px-[27px] text-[16px] font-[600] mb-5">
              <Plus size={15} />
              <span>Add new link</span>
            </button>

            <div className="w-full h-[450px] bg-white-border rounded-[12px] p-[40px] flex flex-col items-center justify-center gap-[20px]">
              <Image alt="" src={"/empty-links.svg"} height={160} width={250} />
              <h1 className="text-[32px] font-[700] text-grey-dark mb-1">
                Let&apos;s get you started
              </h1>
              <p className="text-grey-medium text-[16px] text-center">
                Use the “Add new link” button to get started. Once you have more
                than one link, you can reorder and edit them. We&apos;re here to
                help you share your profiles with everyone!
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end border-t-[1px] border-t-grey-light py-[24px] px-[40px]">
            <button
              disabled={!Boolean(links.length)}
              className="disabled:bg-primary-disabled disabled:hover:shadow-input bg-primary-default text-white-default py-[11px] px-[27px] rounded-[8px] hover:bg-primary-hover transition-all duration-300"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Links;
