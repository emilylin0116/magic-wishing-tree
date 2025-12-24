
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const BURST_PARTICLES = 1600;

const ChristmasBurst: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const startTime = useRef(Date.now());

  const particles = useMemo(() => {
    return Array.from({ length: BURST_PARTICLES }, (_, i) => ({
      phase: (i / BURST_PARTICLES) * Math.PI * 2 * 3.2,
      yOffset: (i / BURST_PARTICLES) * 14 - 7,
      speed: 0.9 + Math.random() * 0.4,
      radius: 3.5 + Math.random() * 2.5,
      noise: Math.random() * 50
    }));
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = (Date.now() - startTime.current) / 1000;

    const transitionTime = 3.0;
    const isDashing = time > transitionTime;

    particles.forEach((p, i) => {
      if (!isDashing) {
        const spiralSpeed = 6.0;
        const angle = p.phase + (time * spiralSpeed);
        const expand = 0.2 + (time / transitionTime) * 0.8;
        const radius = p.radius * expand;
        const y = p.yOffset * (time / transitionTime);
        
        dummy.position.set(
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius
        );
        dummy.scale.setScalar(0.06);
        dummy.rotation.set(angle, time, 0);
      } else {
        const dashTime = time - transitionTime;
        const angle = p.phase + (transitionTime * 6.0);
        const startPos = new THREE.Vector3(
          Math.cos(angle) * p.radius,
          p.yOffset,
          Math.sin(angle) * p.radius
        );
        const targetPos = new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          35
        );
        
        const progress = Math.min(dashTime / 1.5, 1);
        const easedProgress = Math.pow(progress, 3);
        
        dummy.position.lerpVectors(startPos, targetPos, easedProgress);
        dummy.scale.setScalar(0.1 + easedProgress * 2);
        dummy.rotation.set(dashTime * 12, dashTime * 6, 0);
      }

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      
      const pink = new THREE.Color("#FF1493");
      const white = new THREE.Color("#FFFFFF");
      const dashFactor = isDashing ? Math.min((time - transitionTime) * 2.5, 1) : 0;
      meshRef.current!.setColorAt(i, pink.clone().lerp(white, dashFactor));
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, BURST_PARTICLES]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial emissive="#FF1493" emissiveIntensity={14} metalness={1} roughness={0} />
    </instancedMesh>
  );
};

export default ChristmasBurst;
