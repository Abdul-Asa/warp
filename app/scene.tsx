"use client";
import { useFrame } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
} from "@react-three/postprocessing";
import { BlendFunction, ChromaticAberrationEffect } from "postprocessing";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const COUNT = 1000;
const XY_BOUNDS = 50;
const Z_BOUNDS = 30;
const MAX_SPEED_FACTOR = 2;
const MAX_SCALE_FACTOR = 50;

const CHROMATIC_ABBERATION_OFFSET = 0.002;

export interface SceneProps {
  numWarps: number;
}

export const Scene = ({ numWarps }: SceneProps) => {
  const meshRef = useRef<THREE.InstancedMesh>();
  const effectsRef = useRef<ChromaticAberrationEffect>();
  const [warp, setWarp] = useState(0);
  const [warping, setWarping] = useState(false);

  useEffect(() => {
    if (warping || numWarps == 0) return; // Ignore changes to numWarps if a warp is in progress

    const startWarp = () => {
      let start: number | null = null;
      setWarping(true);
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / 10000, 1);
        setWarp(progress < 0.5 ? progress : 1 - progress);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setWarp(0);
          setWarping(false); // Reset the warping state after the warp ends
        }
      };
      window.requestAnimationFrame(step);
    };

    startWarp();
  }, [numWarps]);

  useEffect(() => {
    if (!meshRef.current) return;

    const t = new THREE.Object3D();
    let j = 0;
    for (let i = 0; i < COUNT * 3; i += 3) {
      t.position.x = generatePos();
      t.position.y = generatePos();
      t.position.z = (Math.random() - 0.5) * Z_BOUNDS;
      t.updateMatrix();
      meshRef.current.setMatrixAt(j++, t.matrix);
    }
  }, []);

  const temp = new THREE.Matrix4();
  const tempPos = new THREE.Vector3();
  const tempObject = new THREE.Object3D();
  const tempColor = new THREE.Color();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const velocity = warp < 0.5 ? 2 * warp : 2 * (1 - warp);

    for (let i = 0; i < COUNT; i++) {
      meshRef.current.getMatrixAt(i, temp);

      // update scale
      tempObject.scale.set(1, 1, Math.max(1, velocity * MAX_SCALE_FACTOR));

      // update position
      tempPos.setFromMatrixPosition(temp);
      if (tempPos.z > Z_BOUNDS / 2) {
        tempPos.z = -Z_BOUNDS / 2;
      } else {
        tempPos.z += Math.max(delta, velocity * MAX_SPEED_FACTOR);
      }
      tempObject.position.set(tempPos.x, tempPos.y, tempPos.z);

      // apply transforms
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);

      // update and apply color
      if (tempPos.z > 0) {
        tempColor.r = tempColor.g = tempColor.b = 1;
      } else {
        tempColor.r =
          tempColor.g =
          tempColor.b =
            1 - tempPos.z / (-Z_BOUNDS / 2);
      }
      meshRef.current.setColorAt(i, tempColor);
    }

    const startWarp = () => {
      let start: number | null = null;
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / 10000, 1);
        setWarp(progress < 0.5 ? progress : 1 - progress);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setWarp(0);
        }
      };
      window.requestAnimationFrame(step);
    };

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor)
      meshRef.current.instanceColor.needsUpdate = true;

    // update post processing uniforms
    if (!effectsRef.current) return;
    effectsRef.current.offset.x = Math.max(
      0,
      Math.pow(0.5, state.clock.elapsedTime) * CHROMATIC_ABBERATION_OFFSET
    );
    effectsRef.current.offset.y = Math.max(
      0,
      Math.pow(0.5, state.clock.elapsedTime) * CHROMATIC_ABBERATION_OFFSET
    );
  });

  return (
    <>
      <color args={["#000000"]} attach="background" />
      <instancedMesh
        ref={meshRef as any}
        args={[undefined, undefined, COUNT]}
        matrixAutoUpdate
      >
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color={[1.5, 1.5, 1.5]} toneMapped={false} />
      </instancedMesh>
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} mipmapBlur />
        <ChromaticAberration
          ref={effectsRef as any}
          blendFunction={BlendFunction.NORMAL} // blend mode
          offset={
            new THREE.Vector2(
              CHROMATIC_ABBERATION_OFFSET,
              CHROMATIC_ABBERATION_OFFSET
            )
          }
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>
    </>
  );
};

function generatePos() {
  return (Math.random() - 0.5) * XY_BOUNDS;
}
