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
  const [fetchingLinks, setFetchingLinks] = useState(false);

  const router = useRouter();

  const addLink = () => {
    const link = { ...providedLinks[0] };

    window.sessionStorage.setItem("links", JSON.stringify([...links, link]));
    setLinks((prev) => [...prev, link]);
  };

  useEffect(() => {
    const links = JSON.parse(window.sessionStorage.getItem("links") || "[]");
    setLinks(() => links);

    const listenStorageChange = () => {
      const links = JSON.parse(window.sessionStorage.getItem("links") || "[]");
      setLinks(() => links);
    };
    window.addEventListener("storage", listenStorageChange);
    return () => window.removeEventListener("storage", listenStorageChange);
  }, []);

  useEffect(() => {
    setFetchingLinks(true);
    const user = JSON.parse(window.sessionStorage.getItem("user") as string);
    if (!user) {
      router.replace("/signin");
    }

    getFromDb(user.uid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUrl = (selectedLink: LinkProps, index: number) => {
    const url = selectedLink.link;

    // check if url is valid
    if (!url) {
      const links = JSON.parse(
        window.sessionStorage.getItem("links") as string
      );
      const link = links.find(
        (link: LinkProps) => link.name === selectedLink.name
      );
      link.error = "Can't be empty";

      links[index] = link;
      console.log(links);
      window.sessionStorage.setItem("links", JSON.stringify(links));
      window.dispatchEvent(new Event("storage"));

      return "Can't be empty";
    }

    if (
      url.includes("https://") ||
      url.includes("http://") ||
      url.includes("www.")
    ) {
      return;
    } else {
      const links = JSON.parse(
        window.sessionStorage.getItem("links") as string
      );
      const link = links.find(
        (link: LinkProps) => link.name === selectedLink.name
      );
      link.error = "Please check the URL";

      links[index] = link;
      window.sessionStorage.setItem("links", JSON.stringify(links));
      window.dispatchEvent(new Event("storage"));

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

    const userid = JSON.parse(
      window.sessionStorage.getItem("user") as string
    ).uid;
    if (!userid) {
      window.sessionStorage.removeItem("links");
      window.sessionStorage.removeItem("user");
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
        window.sessionStorage.setItem("links", JSON.stringify(data.links));
      window.dispatchEvent(new Event("storage"));
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
    toast.success("Links saved successfully", {
      description: "You can now share your links with anyone",
      duration: 2000,
    });
    setTimeout(() => {
      router.push("/dashboard/profile");
    }, 2300);
  };

  return (
    <div className="font-default sm:p-[16px] p-0 flex flex-col g-0 sm:gap-[24px] h-full">
      <DashboardHeader type={"links"} />

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
                  <button
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
                  </button>
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
