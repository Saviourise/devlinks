import React from "react";
import Preview from "./Preview";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import app from "@/utils/firebase";

// write a generateStaticParams function
export async function generateStaticParams() {
  const db = getFirestore(app);

  const emails: any = [];

  const q = query(collection(db, "links"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    emails.push({ email: doc.data().email });
  });

  return emails;
}

export default function Page({ params }: { params: { email: string } }) {
  return <Preview params={params} />;
}
