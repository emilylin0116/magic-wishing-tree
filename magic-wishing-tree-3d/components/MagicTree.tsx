
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { HandData } from '../types';

const LEAF_COUNT = 12000; // Increased from 7500 for high density
const CUBE_COUNT = 250;   // Slightly more ornaments for the bigger tree
const ICOSA_COUNT = 250;
const RIBBON_COUNT = 850;

const MagicTree: React.FC<{ handData: HandData | null }> = ({ handData }) => {
  const leafRef = useRef<THREE.InstancedMesh>(null);
  const cubeRef = useRef<THREE.InstancedMesh>(null);
  const icosaRef = useRef<THREE.InstancedMesh>(null);
  const ribbonRef = useRef<THREE.InstancedMesh>(null);

  const treeHeight = 11;
  const treeBaseRadius = 4.8;

  const initialData = useMemo(() => {
    const leafData = [];
    const baseGreens = ['#0B3D0B', '#196619', '#33CC33'];
    const accents = ['#B7E778', '#A0FFC0'];
    
    for (let i = 0; i < LEAF_COUNT; i++) {
      const y = Math.random() * treeHeight;
      const ratio = 1 - (y / treeHeight);
      
      // Pack leaves more densely toward the core by using a lower power for radial distribution
      // and ensuring a base coverage radius.
      const radialFactor = Math.pow(Math.random(), 0.5); 
      const radius = ratio * treeBaseRadius * (0.45 + radialFactor * 0.6);
      const angle = Math.random() * Math.PI * 2;
      
      let colorStr = baseGreens[Math.floor(Math.random() * baseGreens.length)];
      // Add more highlight variety at different heights
      if (Math.random() > 0.85) colorStr = accents[0];
      if (Math.random() > 0.94) colorStr = accents[1];

      leafData.push({
        pos: new THREE.Vector3(
          Math.cos(angle) * radius,
          y - treeHeight / 2,
          Math.sin(angle) * radius
        ),
        // Slightly smaller range for tighter packing aesthetic
        scale: 0.025 + Math.random() * 0.075,
        color: new THREE.Color(colorStr),
        phase: Math.random() * Math.PI * 2,
        speed: 0.12 + Math.random() * 0.35
      });
    }

    const generateOrnaments = (count: number) => {
      const data = [];
      const ornamentColors = ['#FFD700', '#FFFFFF', '#DDA0DD'];
      for (let i = 0; i < count; i++) {
        const y = Math.random() * (treeHeight - 0.8);
        const ratio = 1 - (y / treeHeight);
        const radius = ratio * treeBaseRadius * 1.04;
        const angle = Math.random() * Math.PI * 2;
        data.push({
          pos: new THREE.Vector3(Math.cos(angle) * radius, y - treeHeight / 2, Math.sin(angle) * radius),
          color: new THREE.Color(ornamentColors[Math.floor(Math.random() * ornamentColors.length)]),
          phase: Math.random() * Math.PI * 2
        });
      }
      return data;
    };

    const ribbonData = [];
    const loops = 3;
    for (let i = 0; i < RIBBON_COUNT; i++) {
      const t = i / RIBBON_COUNT;
      const angle = t * Math.PI * 2 * loops;
      const y = t * treeHeight;
      const radius = (1 - (y / treeHeight)) * treeBaseRadius * 1.12;
      ribbonData.push({
        pos: new THREE.Vector3(Math.cos(angle) * radius, y - treeHeight / 2, Math.sin(angle) * radius),
        phase: t * Math.PI * 35
      });
    }

    return { 
      leafData, 
      cubeData: generateOrnaments(CUBE_COUNT), 
      icosaData: generateOrnaments(ICOSA_COUNT), 
      ribbonData 
    };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const bloomDuration = 3.2;
    const bloomProgress = Math.min(time / bloomDuration, 1.0);
    const easedBloom = 1 - Math.pow(1 - bloomProgress, 4);

    const gripFactor = handData?.isGrip || handData?.isPinch ? 0.65 : 1.0;
    const openFactor = handData?.isOpen ? 1.35 : 1.0;
    const interactionScale = gripFactor * openFactor;

    if (leafRef.current) {
      initialData.leafData.forEach((data, i) => {
        // Subtle Brownian-like float motion
        const swayX = Math.sin(time * 0.45 + data.phase) * 0.09;
        const swayZ = Math.cos(time * 0.45 + data.phase) * 0.09;
        
        dummy.position.copy(data.pos);
        dummy.position.x = (dummy.position.x + swayX) * easedBloom * interactionScale;
        dummy.position.z = (dummy.position.z + swayZ) * easedBloom * interactionScale;
        dummy.position.y += Math.sin(time * 0.3 + data.phase) * 0.06;

        dummy.scale.setScalar(data.scale * easedBloom);
        dummy.rotation.set(time * 0.15 + data.phase, time * 0.1, data.phase * 0.2);
        dummy.updateMatrix();
        leafRef.current!.setMatrixAt(i, dummy.matrix);
        leafRef.current!.setColorAt(i, data.color);
      });
      leafRef.current.instanceMatrix.needsUpdate = true;
      if (leafRef.current.instanceColor) leafRef.current.instanceColor.needsUpdate = true;
    }

    const updateOrnaments = (ref: THREE.InstancedMesh | null, dataSet: any[], size: number) => {
      if (ref) {
        dataSet.forEach((data, i) => {
          const bounce = Math.sin(time * 1.8 + data.phase) * 0.12;
          dummy.position.copy(data.pos);
          dummy.position.x *= easedBloom * interactionScale;
          dummy.position.z *= easedBloom * interactionScale;
          dummy.position.y += bounce;
          dummy.scale.setScalar(size * easedBloom * (0.92 + Math.sin(time * 1.2 + data.phase) * 0.08));
          dummy.rotation.y = time * 0.7 + data.phase;
          dummy.updateMatrix();
          ref.setMatrixAt(i, dummy.matrix);
          ref.setColorAt(i, data.color);
        });
        ref.instanceMatrix.needsUpdate = true;
        if (ref.instanceColor) ref.instanceColor.needsUpdate = true;
      }
    };

    updateOrnaments(cubeRef.current, initialData.cubeData, 0.17);
    updateOrnaments(icosaRef.current, initialData.icosaData, 0.19);

    if (ribbonRef.current) {
      initialData.ribbonData.forEach((data, i) => {
        const pulse = 1 + Math.sin(time * 7 + data.phase) * 0.35;
        dummy.position.copy(data.pos);
        dummy.position.x *= easedBloom * interactionScale;
        dummy.position.z *= easedBloom * interactionScale;
        dummy.scale.setScalar(0.04 * pulse * easedBloom);
        dummy.rotation.set(time * 3.5, time * 2, 0);
        dummy.updateMatrix();
        ribbonRef.current!.setMatrixAt(i, dummy.matrix);
      });
      ribbonRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      <instancedMesh ref={leafRef} args={[undefined, undefined, LEAF_COUNT]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          metalness={0.8} 
          roughness={0.2} 
          emissive="#0B3D0B" 
          emissiveIntensity={0.65} 
        />
      </instancedMesh>

      <instancedMesh ref={cubeRef} args={[undefined, undefined, CUBE_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial metalness={1.0} roughness={0.05} envMapIntensity={2.2} />
      </instancedMesh>

      <instancedMesh ref={icosaRef} args={[undefined, undefined, ICOSA_COUNT]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial metalness={0.15} roughness={0.01} transparent opacity={0.92} envMapIntensity={3.2} />
      </instancedMesh>

      <instancedMesh ref={ribbonRef} args={[undefined, undefined, RIBBON_COUNT]}>
        <tetrahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFB6C1" emissiveIntensity={7} />
      </instancedMesh>
    </group>
  );
};

export default MagicTree;
