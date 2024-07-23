"use client";
import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import app from "../../utils/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Can't be empty"),
  password: yup
    .string()
    .min(8, "Please check again")
    .required("Can't be empty"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Please check again")
    .required("Can't be empty"),
});

const Signup = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const auth = getAuth(app);

  const submitSignupDetails = async (details: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);

    createUserWithEmailAndPassword(auth, details.email, details.password)
      .then((userCredential) => {
        // console.log(userCredential.user);
        toast.success("Account Created Successfully, redirecting...", {
          duration: 2000,
        });

        setTimeout(() => {
          router.push("/signin");
        }, 2300);
      })
      .catch((error) => {
        // console.log(error);
        const errorMessage = error.message;
        toast.error(
          errorMessage.replaceAll("Firebase: ", "").replaceAll("-", " ")
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="font-default w-full min-h-full flex sm:items-center items-start justify-center sm:bg-white-border bg-white-default p-[32px]">
      <div className="flex flex-col sm:gap-[50px] gap-[64px] items-center justify-center sm:w-[500px] w-full">
        <div className="flex flex-row sm:justify-center justify-start items-center gap-2 w-full">
          <Image src="/devlinks_logo.svg" alt="logo" width={34} height={34} />
          <p className="text-grey-dark text-[32px] font-[700]">devlinks</p>
        </div>

        <div className="sm:p-[40px] p-0 rounded-[12px] bg-white-default w-full">
          <h1 className="text-grey-dark sm:text-[32px] text-[24px] font-[700] mb-[8px]">
            Create Account
          </h1>
          <p className="text-[16px] text-grey-medium">
            Let&apos;s get you started sharing your links!
          </p>

          <form
            action=""
            onSubmit={handleSubmit(submitSignupDetails)}
            className="mt-[40px] flex flex-col gap-[24px] group w-full"
            noValidate={true}
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-grey-dark text-[12px]">
                Email Address
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    width="14"
                    height="10"
                    viewBox="0 0 14 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 0H1C0.867392 0 0.740215 0.0526785 0.646447 0.146447C0.552678 0.240215 0.5 0.367392 0.5 0.5V9C0.5 9.26522 0.605357 9.51957 0.792893 9.70711C0.98043 9.89464 1.23478 10 1.5 10H12.5C12.7652 10 13.0196 9.89464 13.2071 9.70711C13.3946 9.51957 13.5 9.26522 13.5 9V0.5C13.5 0.367392 13.4473 0.240215 13.3536 0.146447C13.2598 0.0526785 13.1326 0 13 0ZM12.5 9H1.5V1.63688L6.66187 6.36875C6.75412 6.45343 6.87478 6.50041 7 6.50041C7.12522 6.50041 7.24588 6.45343 7.33813 6.36875L12.5 1.63688V9Z"
                      fill="#737373"
                    />
                  </svg>
                </div>
                <input
                  {...register("email")}
                  placeholder="e.g. alex@email.com"
                  type="email"
                  required
                  className={`border-[1px] border-grey-light rounded-[8px] py-[12px] px-[16px] text-grey-dark placeholder-grey-light text-[16px] block w-full ps-10 focus:outline-primary-default focus:shadow-input transition-all duration-300 ${
                    errors.email &&
                    "border-red focus:outline-red focus:shadow-none pe-24"
                  }`}
                />
                <div className="absolute inset-y-0 end-5 flex items-center ps-3 pointer-events-none">
                  {errors.email && (
                    <p className="text-[12px] text-red">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-grey-dark text-[12px]">
                Create password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    width="12"
                    height="14"
                    viewBox="0 0 12 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 5H9V3.5C9 2.70435 8.68393 1.94129 8.12132 1.37868C7.55871 0.81607 6.79565 0.5 6 0.5C5.20435 0.5 4.44129 0.81607 3.87868 1.37868C3.31607 1.94129 3 2.70435 3 3.5V5H1C0.734784 5 0.48043 5.10536 0.292893 5.29289C0.105357 5.48043 0 5.73478 0 6V13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14H11C11.2652 14 11.5196 13.8946 11.7071 13.7071C11.8946 13.5196 12 13.2652 12 13V6C12 5.73478 11.8946 5.48043 11.7071 5.29289C11.5196 5.10536 11.2652 5 11 5ZM6.5 9.91438V11.5C6.5 11.6326 6.44732 11.7598 6.35355 11.8536C6.25979 11.9473 6.13261 12 6 12C5.86739 12 5.74021 11.9473 5.64645 11.8536C5.55268 11.7598 5.5 11.6326 5.5 11.5V9.91438C5.16639 9.79643 4.88522 9.56434 4.70618 9.25914C4.52715 8.95393 4.46177 8.59526 4.5216 8.24651C4.58144 7.89776 4.76264 7.58139 5.03317 7.35332C5.3037 7.12525 5.64616 7.00016 6 7.00016C6.35384 7.00016 6.6963 7.12525 6.96683 7.35332C7.23736 7.58139 7.41856 7.89776 7.4784 8.24651C7.53823 8.59526 7.47285 8.95393 7.29382 9.25914C7.11478 9.56434 6.83361 9.79643 6.5 9.91438ZM8 5H4V3.5C4 2.96957 4.21071 2.46086 4.58579 2.08579C4.96086 1.71071 5.46957 1.5 6 1.5C6.53043 1.5 7.03914 1.71071 7.41421 2.08579C7.78929 2.46086 8 2.96957 8 3.5V5Z"
                      fill="#737373"
                    />
                  </svg>
                </div>
                <input
                  {...register("password")}
                  placeholder="At least 8 characters"
                  type="password"
                  required
                  className={`border-[1px] border-grey-light rounded-[8px] py-[12px] px-[16px] text-grey-dark placeholder-grey-light text-[16px] block w-full ps-10 focus:outline-primary-default focus:shadow-input transition-all duration-300 ${
                    errors.password &&
                    "border-red focus:outline-red focus:shadow-none pe-24"
                  }`}
                />
                <div className="absolute inset-y-0 end-5 flex items-center ps-3 pointer-events-none">
                  {errors.password && (
                    <p className="text-[12px] text-red">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirmPassword"
                className="text-grey-dark text-[12px]"
              >
                Confirm password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    width="12"
                    height="14"
                    viewBox="0 0 12 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 5H9V3.5C9 2.70435 8.68393 1.94129 8.12132 1.37868C7.55871 0.81607 6.79565 0.5 6 0.5C5.20435 0.5 4.44129 0.81607 3.87868 1.37868C3.31607 1.94129 3 2.70435 3 3.5V5H1C0.734784 5 0.48043 5.10536 0.292893 5.29289C0.105357 5.48043 0 5.73478 0 6V13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14H11C11.2652 14 11.5196 13.8946 11.7071 13.7071C11.8946 13.5196 12 13.2652 12 13V6C12 5.73478 11.8946 5.48043 11.7071 5.29289C11.5196 5.10536 11.2652 5 11 5ZM6.5 9.91438V11.5C6.5 11.6326 6.44732 11.7598 6.35355 11.8536C6.25979 11.9473 6.13261 12 6 12C5.86739 12 5.74021 11.9473 5.64645 11.8536C5.55268 11.7598 5.5 11.6326 5.5 11.5V9.91438C5.16639 9.79643 4.88522 9.56434 4.70618 9.25914C4.52715 8.95393 4.46177 8.59526 4.5216 8.24651C4.58144 7.89776 4.76264 7.58139 5.03317 7.35332C5.3037 7.12525 5.64616 7.00016 6 7.00016C6.35384 7.00016 6.6963 7.12525 6.96683 7.35332C7.23736 7.58139 7.41856 7.89776 7.4784 8.24651C7.53823 8.59526 7.47285 8.95393 7.29382 9.25914C7.11478 9.56434 6.83361 9.79643 6.5 9.91438ZM8 5H4V3.5C4 2.96957 4.21071 2.46086 4.58579 2.08579C4.96086 1.71071 5.46957 1.5 6 1.5C6.53043 1.5 7.03914 1.71071 7.41421 2.08579C7.78929 2.46086 8 2.96957 8 3.5V5Z"
                      fill="#737373"
                    />
                  </svg>
                </div>
                <input
                  {...register("confirmPassword")}
                  placeholder="At least 8 characters"
                  type="password"
                  required
                  className={`border-[1px] border-grey-light rounded-[8px] py-[12px] px-[16px] text-grey-dark placeholder-grey-light text-[16px] block w-full ps-10 focus:outline-primary-default focus:shadow-input transition-all duration-300 ${
                    errors.confirmPassword &&
                    "border-red focus:outline-red focus:shadow-none pe-24"
                  }`}
                />
                <div className="absolute inset-y-0 end-5 flex items-center ps-3 pointer-events-none">
                  {errors.confirmPassword && (
                    <p className="text-[12px] text-red">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <p className="text-grey-medium font-[12px]">
              Password must contain at least 8 characters
            </p>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-default text-white-default rounded-[8px] py-[12px] text-[16px] font-medium hover:bg-primary-active transition-all duration-300 flex flex-row items-center justify-center gap-2 disabled:bg-primary-disabled"
              >
                {loading && (
                  <div
                    className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status"
                  >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
                  </div>
                )}
                Create new account
              </button>
            </div>

            <div className="flex sm:flex-row flex-col items-center justify-center gap-1">
              <p className="font-[16px] text-[#888888]">
                Already have an account?
              </p>
              <Link href="/signin" className="text-primary-default font-[16px]">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
