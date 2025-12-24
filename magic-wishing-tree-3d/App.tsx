
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette, Noise } from '@react-three/postprocessing';
import { OrbitControls } from '@react-three/drei';
import Scene from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import HandProcessor from './components/HandProcessor';
import { HandData } from './types';

export default function App() {
  const [wish, setWish] = useState('');
  const [bursting, setBursting] = useState(false);
  const [handData, setHandData] = useState<HandData | null>(null);
  const [showPunchline, setShowPunchline] = useState(false);
  const [sceneKey, setSceneKey] = useState(0);

  const handleWishSubmit = (text: string) => {
    setWish(text);
    // Sequence starts: wishing particles reach core then burst
    setTimeout(() => {
      setBursting(true);
      // Burst completes after spiral + dash
      setTimeout(() => {
        setShowPunchline(true);
      }, 4500);
    }, 2000);
  };

  const handleReset = () => {
    setWish('');
    setBursting(false);
    setShowPunchline(false);
    setSceneKey(prev => prev + 1);
  };

  return (
    <div 
      className="w-full h-screen relative overflow-hidden font-sans" 
      style={{ background: 'linear-gradient(to bottom, #0A000A, #150015)' }}
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 6, 18], fov: 40 }}
        gl={{ antialias: false, stencil: false, depth: true, alpha: true }}
        dpr={1}
      >
        <Suspense fallback={null}>
          <Scene 
            key={sceneKey}
            wish={wish} 
            bursting={bursting} 
            handData={handData} 
            onWishConsumed={() => {}} 
          />
          
          <EffectComposer disableNormalPass>
            <Bloom 
              luminanceThreshold={0.2} 
              mipmapBlur 
              intensity={2.8} 
              radius={0.7} 
            />
            <Noise opacity={0.04} />
            <Vignette eskil={false} offset={0.05} darkness={1.2} />
          </EffectComposer>
        </Suspense>

        <OrbitControls 
          enablePan={false} 
          maxPolarAngle={Math.PI / 1.7} 
          minDistance={8} 
          maxDistance={25}
          autoRotate={!bursting && !showPunchline && !wish}
          autoRotateSpeed={0.5}
          enableDamping={true}
        />
        
        {/* Slightly lower ambient intensity for higher contrast */}
        <ambientLight intensity={0.5} color="#f8d5ff" />
        <pointLight position={[10, 10, 10]} intensity={3.5} color="#ff22aa" />
        <pointLight position={[-10, 5, -10]} intensity={2.5} color="#44ffcc" />
        <spotLight position={[0, 15, 0]} angle={0.4} penumbra={1} intensity={7} color="#ffffff" />
      </Canvas>

      {/* UI Elements */}
      <UIOverlay 
        onWish={handleWishSubmit} 
        onReset={handleReset}
        bursting={bursting}
        showPunchline={showPunchline}
      />

      {/* Hand Gesture Radar */}
      <div className="absolute bottom-6 right-6 w-40 h-28 border border-white/10 rounded-3xl overflow-hidden bg-black/50 backdrop-blur-xl shadow-2xl pointer-events-none">
         <HandProcessor onHandUpdate={setHandData} />
      </div>

      {/* Screen depth overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>
    </div>
  );
}
