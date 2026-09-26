"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Sparkles, Grid, Stars } from "@react-three/drei";
import * as THREE from "three";

function AnimatedGrid() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      // Create a forward moving effect
      gridRef.current.position.z = (state.clock.elapsedTime * 2) % 10;
    }
  });

  return (
    <group ref={gridRef}>
      <Grid 
        infiniteGrid 
        fadeDistance={40} 
        cellColor="#ff007f" 
        sectionColor="#00f2fe" 
        sectionSize={3} 
        cellSize={1} 
        position={[0, -2, -10]} 
      />
    </group>
  );
}

export default function ThreeDBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 1, 5], fov: 60 }}>
        <color attach="background" args={["#030308"]} />
        <fog attach="fog" args={["#030308", 5, 30]} />
        
        <Suspense fallback={null}>
           {/* Moving Synthwave Grid */}
           <AnimatedGrid />
           
           {/* Stars/Particles in the background */}
           <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
           <Sparkles count={200} scale={20} size={2} speed={0.4} color="#00f2fe" opacity={0.6} />

           <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
