"use client";

import DashboardHeader from "@/components/DashboardHeader";
import { providedLinks } from "@/data/Links";
import app from "@/utils/firebase";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { ArrowRight, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LinkProps } from "../links/page";
import { toast } from "sonner";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const Profile = () => {
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [fetchingLinks, setFetchingLinks] = useState(false);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | string>("");
  const [details, setDetails] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [errors, setErrors] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
  });

  let user: any = null;

  useEffect(() => {
    user = JSON.parse(sessionStorage.getItem("user") as string);
  }, []);

  const router = useRouter();

  useEffect(() => {
    setFetchingLinks(true);
    const user = JSON.parse(sessionStorage.getItem("user") as string);
    if (!user) {
      router.replace("/signin");
    }

    getFromDb(user.uid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFromDb = async (userid: string) => {
    const db = getFirestore(app);
    const docRef = doc(db, "links", userid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      data.links.length && setLinks(data.links);
      setDetails({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
      });
      setFile(data.profilePicture);
    }

    setFetchingLinks(false);
  };

  const displayFile = (file: File | string) => {
    try {
      return URL.createObjectURL(file as File);
    } catch (error) {
      return file;
    }
  };

  const validateInput = () => {
    if (details.firstName && details.lastName && details.email) {
      return true;
    }

    const errors = {
      firstName: "",
      lastName: "",
      email: "",
    };

    if (!details.firstName) {
      errors.firstName = "Can't be empty";
    }

    if (!details.lastName) {
      errors.lastName = "Can't be empty";
    }

    if (!details.email) {
      errors.email = "Can't be empty";
    }

    setErrors(errors);

    return false;
  };

  const uploadProfilePicture = async () => {
    setSaving(true);

    if (!user) {
      router.replace("/signin");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("links");
      return;
    }

    const storage = getStorage(app);
    const userid = user.uid;

    const storageRef = ref(storage, `${userid}/profile.png`);

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file as File);
      reader.onload = async () => {
        const base64 = reader.result as string;
        const blob = await (await fetch(base64)).blob();
        const snapshot = await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        const db = getFirestore(app);
        const docRef = doc(db, "links", userid);
        await updateDoc(docRef, {
          profilePicture: downloadUrl,
        });
        toast.success("Profile picture uploaded successfully");
        setSaving(false);
      };
    }
  };

  const saveProfile = async () => {
    const isvalid = validateInput();

    if (!file) {
      toast.error("Please upload a profile picture");
      return setSaving(false);
    }

    if (!isvalid) {
      toast.error("Please fill all the details");
      return setSaving(false);
    }

    // check if file is string
    if (typeof file !== "string") {
      await uploadProfilePicture();
    }

    const userid = user.uid;

    const db = getFirestore(app);
    const docRef = doc(db, "links", userid);
    await updateDoc(docRef, {
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
    })
      .then(() => {
        toast.success("Profile updated successfully");
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(
          errorMessage.replaceAll("Firebase: ", "").replaceAll("-", " ")
        );
      })
      .finally(() => {
        setSaving(false);
      });
  };

  return (
    <div className="font-default sm:p-[16px] p-0 flex flex-col g-0 sm:gap-[24px] h-full">
      <DashboardHeader type={"profile"} />

      <div className="flex flex-row gap-10 sm:p-0 p-[24px]">
        <div className="lg:flex hidden h-[850px] w-[40%] bg-white-default rounded-[12px] p-[40px] relative mb-[16px] justify-center items-center">
          <Image
            src={"/preview-profile.svg"}
            width={307}
            height={631}
            className="absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]"
            alt=""
          />

          {file && (
            <Image
              src={displayFile(file) as string}
              alt="profile"
              width={96}
              height={96}
              className="w-[96px] h-[96px] rounded-full object-cover absolute top-[170px]"
            />
          )}

          {(details.firstName || details.lastName || details.email) && (
            <div className="bg-white-default absolute top-[270px] p-[20px] flex flex-col items-center justify-center gap-[8px]">
              <p className="text-grey-dark text-[18px] font-[600] leading-[27px] text-center">
                {details.firstName} {details.lastName}
              </p>
              <p className="text-grey-medium text-[14px] font-[400] leading-[27px] text-center">
                {details.email}
              </p>
            </div>
          )}

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
              Profile Details
            </h1>

            <p className="text-grey-medium text-[16px]">
              Add your details to create a personal touch to your profile.
            </p>
          </div>

          <div className="flex flex-col gap-5 sm:px-[40px] px-[24px]">
            <div className="bg-white-border flex sm:flex-row flex-col gap-[12px] rounded-[12px] p-[20px] sm:items-center items-start justify-between">
              <p className="text-grey-medium text-[16px] sm:w-[50%] w-full">
                Profile picture
              </p>

              <input
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/jpg"
                id="file"
                name="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFile(file);
                  }
                }}
              />
              <label
                htmlFor="file"
                className={`min-w-[193px] min-h-[193px] rounded-[12px] ${
                  file ? "" : "bg-primary-disabled"
                } flex flex-col gap-[12px] items-center justify-center cursor-pointer`}
              >
                {file && (
                  <Image
                    src={displayFile(file) as string}
                    alt="profile"
                    width={193}
                    height={193}
                    className="w-[193px] h-[193px] rounded-[12px] object-cover absolute brightness-50"
                  />
                )}
                {!file ? (
                  <svg
                    width="34"
                    height="28"
                    viewBox="0 0 34 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="z-10"
                  >
                    <path
                      d="M30.75 0.25H3.25C2.58696 0.25 1.95107 0.513392 1.48223 0.982233C1.01339 1.45107 0.75 2.08696 0.75 2.75V25.25C0.75 25.913 1.01339 26.5489 1.48223 27.0178C1.95107 27.4866 2.58696 27.75 3.25 27.75H30.75C31.413 27.75 32.0489 27.4866 32.5178 27.0178C32.9866 26.5489 33.25 25.913 33.25 25.25V2.75C33.25 2.08696 32.9866 1.45107 32.5178 0.982233C32.0489 0.513392 31.413 0.25 30.75 0.25ZM30.75 2.75V18.8047L26.6766 14.7328C26.4444 14.5006 26.1688 14.3164 25.8654 14.1907C25.5621 14.0651 25.2369 14.0004 24.9086 14.0004C24.5802 14.0004 24.2551 14.0651 23.9518 14.1907C23.6484 14.3164 23.3728 14.5006 23.1406 14.7328L20.0156 17.8578L13.1406 10.9828C12.6718 10.5143 12.0362 10.2512 11.3734 10.2512C10.7107 10.2512 10.075 10.5143 9.60625 10.9828L3.25 17.3391V2.75H30.75ZM3.25 20.875L11.375 12.75L23.875 25.25H3.25V20.875ZM30.75 25.25H27.4109L21.7859 19.625L24.9109 16.5L30.75 22.3406V25.25ZM19.5 9.625C19.5 9.25416 19.61 8.89165 19.816 8.58331C20.022 8.27496 20.3149 8.03464 20.6575 7.89273C21.0001 7.75081 21.3771 7.71368 21.7408 7.78603C22.1045 7.85837 22.4386 8.03695 22.7008 8.29917C22.963 8.5614 23.1416 8.89549 23.214 9.2592C23.2863 9.62292 23.2492 9.99992 23.1073 10.3425C22.9654 10.6851 22.725 10.978 22.4167 11.184C22.1084 11.39 21.7458 11.5 21.375 11.5C20.8777 11.5 20.4008 11.3025 20.0492 10.9508C19.6975 10.5992 19.5 10.1223 19.5 9.625Z"
                      fill="#633CFF"
                    />
                  </svg>
                ) : (
                  <svg
                    width="34"
                    height="28"
                    viewBox="0 0 34 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="z-10"
                  >
                    <path
                      d="M30.75 0.25H3.25C2.58696 0.25 1.95107 0.513392 1.48223 0.982233C1.01339 1.45107 0.75 2.08696 0.75 2.75V25.25C0.75 25.913 1.01339 26.5489 1.48223 27.0178C1.95107 27.4866 2.58696 27.75 3.25 27.75H30.75C31.413 27.75 32.0489 27.4866 32.5178 27.0178C32.9866 26.5489 33.25 25.913 33.25 25.25V2.75C33.25 2.08696 32.9866 1.45107 32.5178 0.982233C32.0489 0.513392 31.413 0.25 30.75 0.25ZM30.75 2.75V18.8047L26.6766 14.7328C26.4444 14.5006 26.1688 14.3164 25.8654 14.1907C25.5621 14.0651 25.2369 14.0004 24.9086 14.0004C24.5802 14.0004 24.2551 14.0651 23.9518 14.1907C23.6484 14.3164 23.3728 14.5006 23.1406 14.7328L20.0156 17.8578L13.1406 10.9828C12.6718 10.5143 12.0362 10.2512 11.3734 10.2512C10.7107 10.2512 10.075 10.5143 9.60625 10.9828L3.25 17.3391V2.75H30.75ZM3.25 20.875L11.375 12.75L23.875 25.25H3.25V20.875ZM30.75 25.25H27.4109L21.7859 19.625L24.9109 16.5L30.75 22.3406V25.25ZM19.5 9.625C19.5 9.25416 19.61 8.89165 19.816 8.58331C20.022 8.27496 20.3149 8.03464 20.6575 7.89273C21.0001 7.75081 21.3771 7.71368 21.7408 7.78603C22.1045 7.85837 22.4386 8.03695 22.7008 8.29917C22.963 8.5614 23.1416 8.89549 23.214 9.2592C23.2863 9.62292 23.2492 9.99992 23.1073 10.3425C22.9654 10.6851 22.725 10.978 22.4167 11.184C22.1084 11.39 21.7458 11.5 21.375 11.5C20.8777 11.5 20.4008 11.3025 20.0492 10.9508C19.6975 10.5992 19.5 10.1223 19.5 9.625Z"
                      fill="#fff"
                    />
                  </svg>
                )}

                <p
                  className={`z-10 ${
                    file ? "text-white-default" : "text-primary-default"
                  } leading-[24px] text-[16px] font-[600] flex flex-row gap-1 items-center justify-center`}
                >
                  {!file && <Plus size={15} />}{" "}
                  <span>{file ? "Change Image" : "Upload Image"}</span>
                </p>
              </label>
              <p className="text-grey-medium text-[12px] leading-[18px] ">
                Image must be below 1024x1024px. Use PNG or JPG format.
              </p>
            </div>
            <div className="bg-white-border flex flex-col gap-[12px] p-[20px] rounded-[12px] items-center justify-between">
              <div className="flex sm:flex-row flex-col w-full gap-[4px] sm:items-center items-start justify-between">
                <label
                  htmlFor="firstName"
                  className="sm:text-grey-medium text-grey-dark sm:text-[16px] sm:leading-[24px] leading-[18px] text-[12px]"
                >
                  First name*
                </label>

                <div className="relative sm:w-[65%] w-full">
                  <input
                    placeholder="e.g. John"
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={details.firstName}
                    onChange={(e) =>
                      setDetails({ ...details, firstName: e.target.value })
                    }
                    required
                    className={`${
                      errors.firstName &&
                      "border-red focus:outline-red focus:shadow-none pe-24"
                    } border-[1px] border-grey-light rounded-[8px] py-[12px] px-[16px] text-grey-dark placeholder-grey-light text-[16px] block w-full focus:outline-primary-default focus:shadow-input transition-all duration-300`}
                  />
                  <div className="absolute inset-y-0 end-5 flex items-center ps-3 pointer-events-none">
                    {errors.firstName && (
                      <p className="text-[12px] text-red">{errors.firstName}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-row flex-col w-full gap-[4px] sm:items-center items-start justify-between">
                <label
                  htmlFor="lastName"
                  className="sm:text-grey-medium text-grey-dark sm:text-[16px] sm:leading-[24px] leading-[18px] text-[12px]"
                >
                  Last name*
                </label>

                <div className="relative sm:w-[65%] w-full">
                  <input
                    placeholder="e.g. Appleseed"
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={details.lastName}
                    onChange={(e) =>
                      setDetails({ ...details, lastName: e.target.value })
                    }
                    required
                    className={`${
                      errors.lastName &&
                      "border-red focus:outline-red focus:shadow-none pe-24"
                    } border-[1px] border-grey-light rounded-[8px] py-[12px] px-[16px] text-grey-dark placeholder-grey-light text-[16px] block w-full focus:outline-primary-default focus:shadow-input transition-all duration-300`}
                  />
                  <div className="absolute inset-y-0 end-5 flex items-center ps-3 pointer-events-none">
                    {errors.lastName && (
                      <p className="text-[12px] text-red">{errors.lastName}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-row flex-col w-full gap-[4px] sm:items-center items-start justify-between">
                <label
                  htmlFor="email"
                  className="sm:text-grey-medium text-grey-dark sm:text-[16px] sm:leading-[24px] leading-[18px] text-[12px]"
                >
                  Email
                </label>

                <div className="relative sm:w-[65%] w-full">
                  <input
                    placeholder="e.g. email@example.com"
                    type="email"
                    name="email"
                    id="email"
                    value={details.email}
                    onChange={(e) =>
                      setDetails({ ...details, email: e.target.value })
                    }
                    required
                    className={`${
                      errors.email &&
                      "border-red focus:outline-red focus:shadow-none pe-24"
                    } border-[1px] border-grey-light rounded-[8px] py-[12px] px-[16px] text-grey-dark placeholder-grey-light text-[16px] block w-full focus:outline-primary-default focus:shadow-input transition-all duration-300`}
                  />
                  <div className="absolute inset-y-0 end-5 flex items-center ps-3 pointer-events-none">
                    {errors.email && (
                      <p className="text-[12px] text-red">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end border-t-[1px] border-t-grey-light py-[24px] sm:px-[40px] px-[24px] !mt-auto">
            <button
              disabled={!Boolean(links.length)}
              onClick={() => {
                setSaving(true);
                saveProfile();
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
          <h1 className="text-white-default text-[20px]">Fetching Profile</h1>
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

export default Profile;
