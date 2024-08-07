"use client";

import { Star } from "@/components/lotties/Star";
import { useRequestSnap } from "@/hooks/useRequestSnap";

export default function Home() {
  const requestSnap = useRequestSnap();

  return (
    <div className="flex flex-col w-full">
      {/* Do anything inside Metamask */}
      <div className="flex flex-col gap-8 items-center px-24 py-12 w-fit m-auto glass rounded-3xl glass:border-8">
        <div className="flex gap-4">
          <h2 className="text-6xl font-['Reverie'] mr-[4.75rem]">
            Do <span className="font-black underline">anything</span> inside
            Metamask
          </h2>
          <Star />
        </div>

        <span className="text-3xl">
          Ask <span className="font-['Reverie']">SnappyAI</span> to seamlessly
          send funds, swap, bridge, and more.
        </span>

        <button className="btn btn-accent" onClick={requestSnap}>
          Get Started
        </button>
      </div>
    </div>
  );
}
