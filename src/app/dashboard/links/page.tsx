"use client";

import DashboardHeader from "@/components/DashboardHeader";
import LinkComponent from "@/components/LinkComponent";
import { providedLinks } from "@/data/Links";
import app from "@/utils/firebase";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { ArrowRight, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export type LinkProps = {
  name: string;
  svg: React.ReactNode;
  svgActive: React.ReactNode;
  svgWhite: React.ReactNode;
  link: string;
  error?: boolean;
};
const Links = () => {
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [saving, setSaving] = useState(false);
  const [fetchingLinks, setFetchingLinks] = useState(true);

  const router = useRouter();

  const [user, setUser] = useState<any>();

  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem("user") as string));
  }, []);

  const addLink = () => {
    const link = { ...providedLinks[0] };

    sessionStorage.setItem("links", JSON.stringify([...links, link]));
    setLinks((prev) => [...prev, link]);
  };

  useEffect(() => {
    const links = JSON.parse(sessionStorage.getItem("links") || "[]");
    setLinks(() => links);

    const listenStorageChange = () => {
      const links = JSON.parse(sessionStorage.getItem("links") || "[]");
      setLinks(() => links);
    };
    addEventListener("storage", listenStorageChange);
    return () => removeEventListener("storage", listenStorageChange);
  }, []);

  useEffect(() => {
    setFetchingLinks(true);
    const user = JSON.parse(sessionStorage.getItem("user") as string);
    if (!user) {
      return router.replace("/signin");
    }

    getFromDb(user.uid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUrl = (selectedLink: LinkProps, index: number) => {
    const url = selectedLink.link;

    // check if url is valid
    if (!url) {
      const links = JSON.parse(sessionStorage.getItem("links") as string);
      const link = links.find(
        (link: LinkProps) => link.name === selectedLink.name
      );
      link.error = "Can't be empty";

      links[index] = link;
      // console.log(links);
      sessionStorage.setItem("links", JSON.stringify(links));
      dispatchEvent(new Event("storage"));

      return "Can't be empty";
    }

    if (
      url.includes("https://") ||
      url.includes("http://") ||
      url.includes("www.")
    ) {
      return;
    } else {
      const links = JSON.parse(sessionStorage.getItem("links") as string);
      const link = links.find(
        (link: LinkProps) => link.name === selectedLink.name
      );
      link.error = "Please check the URL";

      links[index] = link;
      sessionStorage.setItem("links", JSON.stringify(links));
      dispatchEvent(new Event("storage"));

      return "Please check the URL";
    }
  };

  const saveToDb = async () => {
    for (let i = 0; i < links.length; i++) {
      if (checkUrl(links[i], i)) {
        toast.error(checkUrl(links[i], i));
        return setSaving(false);
      }
    }

    const userid = JSON.parse(sessionStorage.getItem("user") as string).uid;
    if (!userid) {
      sessionStorage.removeItem("links");
      sessionStorage.removeItem("user");
      return router.replace("/signin");
    }

    const linksToStore = links.map((link) => {
      return {
        name: link.name,
        link: link.link,
      };
    });

    const parsedData = {
      userid,
      links: linksToStore,
    };
    saveData(parsedData);
  };

  const getFromDb = async (userid: string) => {
    const db = getFirestore(app);
    const docRef = doc(db, "links", userid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      data.links.length &&
        sessionStorage.setItem("links", JSON.stringify(data.links));
      dispatchEvent(new Event("storage"));
    }

    setFetchingLinks(false);
  };

  const saveData = async (data: {
    userid: string;
    links: { name: string; link: string }[];
  }) => {
    setSaving(true);
    const db = getFirestore(app);
    const docRef = doc(db, "links", data.userid);
    await setDoc(docRef, data);
    setSaving(false);
    toast.success(
      <p className="flex flex-row gap-2 items-center justify-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.25 0.500006H12.6875C12.6046 0.500006 12.5251 0.53293 12.4665 0.591536C12.4079 0.650141 12.375 0.729626 12.375 0.812506V4.25001C12.375 4.58153 12.2433 4.89947 12.0089 5.13389C11.7745 5.36831 11.4565 5.50001 11.125 5.50001H4.8961C4.73454 5.50258 4.57801 5.44378 4.45811 5.33547C4.3382 5.22716 4.26383 5.0774 4.25001 4.91641C4.24433 4.83092 4.25629 4.74518 4.28515 4.6645C4.31401 4.58383 4.35914 4.50995 4.41776 4.44745C4.47637 4.38496 4.5472 4.33518 4.62586 4.30121C4.70452 4.26725 4.78933 4.24982 4.87501 4.25001H10.8125C10.8954 4.25001 10.9749 4.21708 11.0335 4.15848C11.0921 4.09987 11.125 4.02039 11.125 3.93751V0.812506C11.125 0.729626 11.0921 0.650141 11.0335 0.591536C10.9749 0.53293 10.8954 0.500006 10.8125 0.500006H5.1336C4.96939 0.499482 4.80671 0.531604 4.65502 0.594506C4.50333 0.657407 4.36566 0.749834 4.25001 0.866412L0.866412 4.25001C0.749834 4.36566 0.657407 4.50333 0.594506 4.65502C0.531604 4.80671 0.499482 4.96939 0.500006 5.1336V14.25C0.500006 14.5815 0.631702 14.8995 0.866123 15.1339C1.10054 15.3683 1.41849 15.5 1.75001 15.5H14.25C14.5815 15.5 14.8995 15.3683 15.1339 15.1339C15.3683 14.8995 15.5 14.5815 15.5 14.25V1.75001C15.5 1.41849 15.3683 1.10054 15.1339 0.866123C14.8995 0.631702 14.5815 0.500006 14.25 0.500006ZM8.00001 12.375C7.50555 12.375 7.0222 12.2284 6.61108 11.9537C6.19996 11.679 5.87953 11.2885 5.69031 10.8317C5.50109 10.3749 5.45158 9.87223 5.54804 9.38728C5.64451 8.90233 5.88261 8.45687 6.23224 8.10724C6.58187 7.75761 7.02733 7.51951 7.51228 7.42304C7.99723 7.32658 8.4999 7.37609 8.95671 7.56531C9.41353 7.75453 9.80398 8.07496 10.0787 8.48608C10.3534 8.8972 10.5 9.38055 10.5 9.87501C10.5 10.538 10.2366 11.1739 9.76777 11.6428C9.29893 12.1116 8.66305 12.375 8.00001 12.375Z"
            fill="#737373"
          />
        </svg>
        Your changes have been successfully saved!
      </p>,
      {
        description: "You can now share your links with anyone",
        duration: 2000,
      }
    );
    setTimeout(() => {
      router.push("/dashboard/profile");
    }, 2300);
  };

  return (
    <div className="font-default sm:p-[16px] p-0 flex flex-col g-0 sm:gap-[24px] h-full">
      <DashboardHeader type={"links"} email={user?.email} />

      <div className="flex flex-row gap-10 sm:p-0 p-[24px]">
        <div className="lg:flex h-[850px] hidden w-[40%] bg-white-default rounded-[12px] p-[40px] relative mb-[16px] justify-center items-center">
          <Image
            src={"/preview-section.svg"}
            width={307}
            height={631}
            className="absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]"
            alt=""
          />

          <div className="flex flex-col justify-start items-center gap-[20px] mt-[220px] h-[300px] overflow-auto no-scrollbar">
            {links.length &&
              links.map((link: LinkProps, index: number) => {
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
        <div className="lg:h-[850px] h-full lg:w-[60%] w-full bg-white-default rounded-[12px] pt-[40px] flex flex-col gap-[40px]">
          <div className="sm:px-[40px] px-[24px]">
            <h1 className="sm:text-[32px] text-[24px] font-[700] text-grey-dark mb-1">
              Customize your links
            </h1>

            <p className="text-grey-medium text-[16px]">
              Add/edit/remove links below and then share all your profiles with
              the world!
            </p>
          </div>

          <div className="sm:px-[40px] px-[24px]">
            <button
              onClick={addLink}
              className="text-primary-default border-[1px] hover:bg-primary-disabled transition-all duration-300 border-primary-default rounded-[8px] flex flex-row w-full items-center justify-center py-[11px] px-[27px] text-[16px] font-[600] mb-5"
            >
              <Plus size={15} />
              <span>Add new link</span>
            </button>

            {!links.length ? (
              <div className="w-full h-[450px] bg-white-border rounded-[12px] sm:px-[40px] px-[24px] flex flex-col items-center justify-center gap-[20px]">
                <Image
                  alt=""
                  src={"/empty-links.svg"}
                  height={160}
                  width={250}
                />
                <h1 className="sm:text-[32px] text-[24px] text-center font-[700] text-grey-dark mb-1">
                  Let&apos;s get you started
                </h1>
                <p className="text-grey-medium text-[16px] text-center">
                  Use the “Add new link” button to get started. Once you have
                  more than one link, you can reorder and edit them. We&apos;re
                  here to help you share your profiles with everyone!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-[20px] overflow-y-auto h-[500px]">
                {links.map((link: LinkProps, index: number) => {
                  return (
                    <LinkComponent key={index} idx={index} saving={saving} />
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end border-t-[1px] border-t-grey-light py-[24px] sm:px-[40px] px-[24px] !mt-auto">
            <button
              disabled={!Boolean(links.length) || saving}
              onClick={() => {
                setSaving(() => true);
                saveToDb();
              }}
              className="w-full sm:w-max flex items-center justify-center gap-2 disabled:bg-primary-disabled disabled:hover:shadow-input bg-primary-default text-white-default py-[11px] px-[27px] rounded-[8px] hover:bg-primary-hover transition-all duration-300"
            >
              {saving && (
                <div
                  className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                  role="status"
                >
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
                </div>
              )}
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {fetchingLinks && (
        <div className="fixed h-[100vh] w-[100vw] bg-black opacity-60 z-[100] top-0 left-0 flex flex-col items-center gap-10 justify-center">
          <h1 className="text-white-default text-[20px]">Fetching Links</h1>
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

export default Links;
