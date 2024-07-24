"use client";
import { LinkProps } from "@/app/dashboard/links/page";
import { providedLinks } from "@/data/Links";
import app from "@/utils/firebase";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link as LinkIco } from "lucide-react";

const Preview = ({ params }: { params: { email: string } }) => {
  const { email } = params;
  // console.log(decodeURIComponent(email));

  const [fetchingLinks, setFetchingLinks] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const db = getFirestore(app);

  const getProfile = async () => {
    const q = query(
      collection(db, "links"),
      where("email", "==", decodeURIComponent(email))
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setProfile(doc.data());
      setFetchingLinks(false);
    });
  };

  useEffect(() => {
    getProfile();
  }, []);

  const [user, setUser] = useState<any>();

  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem("user") as string));
  }, []);
  return (
    <div className="h-full w-full bg-white-default min-h-[100vh]">
      <div className="w-full sm:h-[357px] h-full pb-10 sm:bg-primary-default bg-white-default rounded-bl-[32px] rounded-br-[32px] p-[24px]">
        <div className="bg-white-default flex flex-row justify-between items-center p-[16px] rounded-[12px] gap-[8px]">
          {user && user.uid === profile?.uid ? (
            <Link
              href="/dashboard/profile"
              className="hover:bg-primary-disabled transition-all duration-300 bg-white-default border-[1px] rounded-[8px] border-primary-default text-primary-default px-[27px] py-[11px] leading-[24px] sm:text-[16px] text-[12px] font-[600]"
            >
              Back to Editor
            </Link>
          ) : (
            <span></span>
          )}

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success(
                <p className="flex flex-row gap-2 items-center justify-center">
                  <LinkIco className="text-grey-medium" size={12} />
                  The link has been copied to your clipboard!
                </p>
              );
            }}
            className="bg-primary-default hover:bg-primary-hover transition-all duration-300 rounded-[8px] text-white-default px-[27px] py-[11px] leading-[24px] sm:text-[16px] text-[12px] font-[600]"
          >
            Share Link
          </button>
        </div>

        <div className="bg-white-default sm:p-[24px] p-0 sm:mt-[100px] mt-[50px] w-[350px] max-w-full h-max mx-auto rounded-[24px] flex flex-col items-center justify-center">
          <Image
            src={profile?.profilePicture}
            alt="profile"
            width={193}
            height={193}
            className="w-[104px] h-[104px] rounded-full border-[4px] border-primary-default object-cover"
          />

          {(profile?.firstName || profile?.lastName || profile?.email) && (
            <div className="bg-white-default p-[20px] flex flex-col items-center justify-center gap-[8px] mb-[30px]">
              <p className="text-grey-dark text-[32px] font-[700] leading-[48px] text-center">
                {profile?.firstName} {profile?.lastName}
              </p>
              <p className="text-grey-medium text-[16px] font-[400] leading-[24px] text-center">
                {profile?.email}
              </p>
            </div>
          )}

          <div className="flex flex-col justify-start items-center gap-[20px] overflow-auto no-scrollbar">
            {profile?.links.length &&
              profile?.links.map((link: LinkProps, index: number) => {
                return (
                  <a
                    href={link.link}
                    target="_blank"
                    key={index}
                    className={`${
                      link.name.toLowerCase() === "github"
                        ? "bg-black"
                        : link.name.toLowerCase() === "youtube"
                        ? "bg-red"
                        : link.name.toLowerCase() === "linkedin"
                        ? "bg-[#2D68FF]"
                        : link.name.toLowerCase() === "frontend mentor"
                        ? "bg-[#0079FF]"
                        : link.name.toLowerCase() === "facebook"
                        ? "bg-[#1877F2]"
                        : "bg-[#000000]"
                    } text-white-default w-[237px] h-[44px] z-50 relative flex flex-row rounded-[8px] items-center py-[11px] px-[16px] gap-[8px] justify-between`}
                  >
                    <span className="flex flex-row items-center gap-[8px]">
                      {
                        providedLinks.find(({ name }) => name === link.name)
                          ?.svgWhite
                      }
                      <span className="capitalize">{link.name}</span>
                    </span>
                    <ArrowRight size={18} />
                  </a>
                );
              })}
          </div>
        </div>
      </div>

      {fetchingLinks && (
        <div className="fixed h-[100vh] w-[100vw] bg-black opacity-60 z-[100] top-0 left-0 flex flex-col items-center gap-10 justify-center">
          <h1 className="text-white-default text-[20px]">
            Fetching Profile and Links
          </h1>
          <div
            className="inline-block h-10 w-10 animate-spin text-primary-default rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;
