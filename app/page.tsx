"use client";

import dynamic from "next/dynamic";

const BoothApp = dynamic(() => import("@/components/BoothApp"), {
  ssr: false,
  loading: () => (
    <div className="grid h-screen place-items-center bg-[#12151a] text-[#e8eaed]">
      Načítám stánek 05…
    </div>
  ),
});

export default function Home() {
  return <BoothApp />;
}
