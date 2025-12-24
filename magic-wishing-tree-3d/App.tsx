import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette, Noise } from '@react-three/postprocessing';
import { OrbitControls } from '@react-three/drei';
import Scene from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import HandProcessor from './components/HandProcessor';
import { HandData } from './types';

// 強制注入全域樣式，徹底解決文字黑屏問題
const GlobalStyle = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    .force-white * {
      color: white !important;
      text-shadow: 0 0 8px rgba(255, 255, 255, 0.4) !important;
    }
    input::placeholder { color: rgba(255, 255, 255, 0.4) !important; }
    input { color: white !important; }
  `}} />
);

export default function App() {
  const [wish, setWish] = useState('');
  const [bursting, setBursting] = useState(false);
  const [handData, setHandData] = useState<HandData | null>(null);
  const [showPunchline, setShowPunchline] = useState(false);
  const [sceneKey, setSceneKey] = useState(0);

  const handleWishSubmit = (text: string) => {
    setWish(text);
    setTimeout(() => {
      setBursting(true);
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
      className="w-full h-screen relative overflow-hidden font-sans force-white" 
      style={{ background: 'linear-gradient(to bottom, #0A000A, #150015)' }}
    >
      <GlobalStyle />

      {/* 3D Canvas - 電流平滑縮放版 */}
      <Canvas
        camera={{ position: [0, 6, 18], fov: 40 }}
        gl={{ 
          antialias: false, 
          stencil: false, 
          depth: true, 
          alpha: true,
          powerPreference: "high-performance" 
        }}
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
              luminanceThreshold={0.15} 
              mipmapBlur 
              intensity={bursting ? 5.0 : 2.5} 
              radius={0.8} 
            />
            <Noise opacity={0.03} />
            <Vignette eskil={false} offset={0.05} darkness={1.1} />
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
          dampingFactor={0.03} // 這裡是絲滑感的關鍵
        />
        
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

      {/* Hand Gesture Radar - 加強背景對比 */}
      <div className="absolute bottom-6 right-6 w-40 h-28 border border-white/20 rounded-3xl overflow-hidden bg-black/70 backdrop-blur-xl shadow-2xl pointer-events-none">
         <HandProcessor onHandUpdate={setHandData} />
      </div>

      {/* Screen depth overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>
    </div>
  );
}
