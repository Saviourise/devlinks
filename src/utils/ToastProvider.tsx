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
      <Toaster richColors position="top-right" expand />
    </>
  );
}
