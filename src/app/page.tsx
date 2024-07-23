"use client";
import { useRouter } from "next/navigation";
import React, { useLayoutEffect } from "react";

const App = () => {
  const router = useRouter();
  useLayoutEffect(() => {
    router.replace("/signin");
  });
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div
        className="inline-block h-10 w-10 animate-spin text-primary-default rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
      </div>
    </div>
  );
};

export default App;
