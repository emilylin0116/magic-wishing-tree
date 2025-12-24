
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface Props {
  text: string;
  onComplete: () => void;
}

const PARTICLE_COUNT = 900;

const WishingParticles: React.FC<Props> = ({ text, onComplete }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const startTime = useRef(Date.now());
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 25,
        25 + Math.random() * 5
      ),
      target: new THREE.Vector3(0, 0, 0),
      speed: 0.006 + Math.random() * 0.012,
      noiseSeed: Math.random() * 100,
      scale: 0.04 + Math.random() * 0.1,
    }));
  }, [text]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = (Date.now() - startTime.current) / 1000;

    particles.forEach((p, i) => {
      const duration = 2.5;
      const progress = Math.min(time / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentPos = new THREE.Vector3().lerpVectors(p.pos, p.target, easedProgress);
      const noiseX = Math.sin(time * 2 + p.noiseSeed) * (1 - progress) * 2;
      const noiseY = Math.cos(time * 1.8 + p.noiseSeed) * (1 - progress) * 2;
      currentPos.x += noiseX;
      currentPos.y += noiseY;

      dummy.position.copy(currentPos);
      dummy.scale.setScalar(p.scale * (1.1 - easedProgress));
      dummy.rotation.set(time * 3, time, 0);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      
      const startColor = new THREE.Color("#FF1493");
      const endColor = new THREE.Color("#FFD700");
      const finalColor = startColor.clone().lerp(endColor, progress);
      meshRef.current!.setColorAt(i, finalColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;

    if (time > 3.0) {
      onComplete();
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshStandardMaterial emissiveIntensity={8} transparent opacity={0.9} metalness={1} roughness={0} />
    </instancedMesh>
  );
};

export default WishingParticles;
