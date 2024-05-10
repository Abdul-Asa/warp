"use client";

import { usePathname, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Perf } from "r3f-perf";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";

const Scene = dynamic(() => import("@/app/scene").then((mod) => mod.Scene), {
  ssr: false,
});
interface ParticlesProps {
  // className?: string;
  // quantity?: number;
  // staticity?: number;
  // ease?: number;
  // refresh?: boolean;
  // proximity?: number;
}

export default function Particles({}: ParticlesProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [warp, setWarp] = useState(0);

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    setWarp(warp + 1);
  }, [pathname, searchParams]);

  return (
    <Canvas
      camera={{
        fov: 100,
        near: 0.1,
        far: 200,
        // position: [15, 5, 5],
      }}
    >
      <Perf />
      <OrbitControls />
      {/* <Stars
          speed={300}
          // radius={100}
          // depth={0}
          // count={5000}
          // factor={4}
          // saturation={0}
          // fade={true}
        /> */}
      <Scene numWarps={warp} />
    </Canvas>
  );
}
