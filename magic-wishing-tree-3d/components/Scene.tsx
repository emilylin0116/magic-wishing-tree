
import React, { useRef } from 'react';
// Added THREE import to resolve namespace error
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import MagicTree from './MagicTree';
import WishingParticles from './WishingParticles';
import ChristmasBurst from './ChristmasBurst';
import { HandData } from '../types';

interface SceneProps {
  wish: string;
  bursting: boolean;
  handData: HandData | null;
  onWishConsumed: () => void;
}

const Scene: React.FC<SceneProps> = ({ wish, bursting, handData, onWishConsumed }) => {
  // Use THREE.Group reference
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Slow rotation
    groupRef.current.rotation.y += 0.002;

    // Gesture interaction: Rotate slightly based on palm position
    if (handData) {
      const targetRotation = (handData.x - 0.5) * 0.5;
      groupRef.current.rotation.y += (targetRotation - groupRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <MagicTree handData={handData} />
      
      {wish && (
        <WishingParticles 
          text={wish} 
          onComplete={onWishConsumed} 
        />
      )}

      {bursting && (
        <ChristmasBurst />
      )}
    </group>
  );
};

export default Scene;
