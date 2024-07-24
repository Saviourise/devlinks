"use client";

import { Toaster } from "sonner";
import "../app/globals.css";

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-center"
        expand
        toastOptions={{
          style: { background: "#333333", color: "#FAFAFA" },
        }}
      />
    </>
  );
}
