"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, Environment, OrbitControls, ContactShadows, Float, Sparkles, Grid } from "@react-three/drei";
import * as THREE from "three";

export default function ThreeDArcade({ itchUrl, title }: { itchUrl: string, title: string }) {
  return (
    <div className="w-full h-full bg-[#050510] relative">
      <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
        <color attach="background" args={["#050510"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[0, 2, 2]} intensity={2} color="#00f2fe" />
        <pointLight position={[0, -1, 2]} intensity={2} color="#ff007f" />
        
        <Suspense fallback={null}>
           {/* Synthwave Grid */}
           <Grid infiniteGrid fadeDistance={20} cellColor="#ff007f" sectionColor="#00f2fe" sectionSize={3} cellSize={1} position={[0, -2, 0]} />

           <Float speed={2} rotationIntensity={0.05} floatIntensity={0.1}>
             <ArcadeCabinet url={itchUrl} />
           </Float>

           <Environment preset="city" />
           <ContactShadows position={[0, -2, 0]} opacity={0.8} scale={10} blur={2} far={4} color="#00f2fe" />
           <Sparkles count={50} scale={10} size={2} speed={0.4} color="#00f2fe" opacity={0.3} />
        </Suspense>

        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={10}
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2} 
          minAzimuthAngle={-Math.PI / 4} 
          maxAzimuthAngle={Math.PI / 4}
          makeDefault 
        />
      </Canvas>
      <div className="absolute bottom-6 w-full text-center pointer-events-none">
        <p className="font-mono text-xs text-[#00f2fe] uppercase tracking-widest animate-pulse drop-shadow-[0_0_5px_#00f2fe]">
          Click and drag to look around
        </p>
      </div>
    </div>
  );
}

function ArcadeCabinet({ url }: { url: string }) {
  const cabinetMaterial = new THREE.MeshStandardMaterial({ color: "#111", roughness: 0.2, metalness: 0.8 });
  const trimMaterial = new THREE.MeshStandardMaterial({ color: "#FF007F", emissive: "#FF007F", emissiveIntensity: 0.5 });
  
  return (
    <group position={[0, -0.5, 0]}>
      {/* Base */}
      <mesh position={[0, -1, 0]} material={cabinetMaterial}>
        <boxGeometry args={[2, 2, 2]} />
      </mesh>
      
      {/* Side Panels */}
      <mesh position={[-1.05, 0.5, 0]} material={trimMaterial}>
        <boxGeometry args={[0.1, 5, 2.2]} />
      </mesh>
      <mesh position={[1.05, 0.5, 0]} material={trimMaterial}>
        <boxGeometry args={[0.1, 5, 2.2]} />
      </mesh>

      {/* Control Panel */}
      <mesh position={[0, 0.2, 1.2]} rotation={[-0.2, 0, 0]} material={cabinetMaterial}>
        <boxGeometry args={[2, 0.2, 0.8]} />
      </mesh>
      
      {/* Buttons */}
      <mesh position={[-0.5, 0.35, 1.3]} material={new THREE.MeshStandardMaterial({ color: "red" })}>
        <cylinderGeometry args={[0.05, 0.05, 0.1]} />
      </mesh>
      <mesh position={[0.4, 0.35, 1.1]} material={new THREE.MeshStandardMaterial({ color: "blue" })}>
        <cylinderGeometry args={[0.05, 0.05, 0.1]} />
      </mesh>
      <mesh position={[0.6, 0.35, 1.1]} material={new THREE.MeshStandardMaterial({ color: "green" })}>
        <cylinderGeometry args={[0.05, 0.05, 0.1]} />
      </mesh>
      <mesh position={[0.8, 0.35, 1.1]} material={new THREE.MeshStandardMaterial({ color: "yellow" })}>
        <cylinderGeometry args={[0.05, 0.05, 0.1]} />
      </mesh>
      {/* Joystick */}
      <mesh position={[-0.5, 0.55, 1.3]} material={new THREE.MeshStandardMaterial({ color: "red" })}>
        <sphereGeometry args={[0.1]} />
      </mesh>
      <mesh position={[-0.5, 0.4, 1.3]} material={new THREE.MeshStandardMaterial({ color: "silver" })}>
        <cylinderGeometry args={[0.02, 0.02, 0.3]} />
      </mesh>

      {/* Marquee */}
      <mesh position={[0, 2.8, 0.5]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[2, 0.5, 0.5]} />
        <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={2} />
      </mesh>
      {/* Marquee Text - Optional, but let's just make it glow for now */}
      
      {/* Screen Backdrop */}
      <mesh position={[0, 1.5, 0.4]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[1.95, 1.95]} />
        <meshBasicMaterial color="black" />
      </mesh>

      {/* The Actual HTML Screen */}
      <Html 
        transform 
        position={[0, 1.5, 0.41]} 
        rotation={[-0.1, 0, 0]}
        scale={0.0019} /* 1.9 units wide / 1000px = 0.0019 */
      >
        <div className="w-[1000px] h-[750px] bg-black border-[10px] border-[#00F2FE] shadow-[0_0_100px_rgba(0,242,254,0.8)] relative flex flex-col">
          {/* Scanlines overlay just for the screen */}
          <div className="absolute inset-0 pointer-events-none opacity-20 z-20" style={{ background: "repeating-linear-gradient(to bottom, transparent 0, transparent 4px, #000 6px)" }} />
          <iframe
            src={(() => {
              try {
                const parts = url.split("/games/");
                if (parts.length > 1) {
                  return `/api/play/${parts[1]}`;
                }
              } catch (e) {}
              return url;
            })()}
            className="w-full h-full border-none relative z-10"
            allow="autoplay; fullscreen; vr"
          />
        </div>
      </Html>
    </group>
  );
}
