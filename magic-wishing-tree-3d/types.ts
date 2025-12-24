
// Added THREE import to resolve namespace error in interfaces
import * as THREE from 'three';

export interface HandData {
  x: number;
  y: number;
  isOpen: boolean;
  isGrip: boolean;
  isPinch: boolean;
}

export interface ParticleData {
  // Defined using the THREE namespace
  pos: THREE.Vector3;
  target: THREE.Vector3;
  speed: number;
  noise: number;
  scale: number;
}
