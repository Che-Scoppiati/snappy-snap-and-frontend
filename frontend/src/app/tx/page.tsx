"use client";

import { Header } from "@/components/Header";
import { useRequestSnap } from "@/hooks/useRequestSnap";

export default function Tx() {
  const requestSnap = useRequestSnap();
  return (
    <>
      <button className="btn" onClick={requestSnap}>
        Request Snap
      </button>
    </>
  );
}
