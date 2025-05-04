import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Mesh } from 'three';

// This component represents a simplified 3D perfume bottle model
const PerfumeModel = ({ rotationSpeed = 0.003 }) => {
  const meshRef = useRef<Mesh>(null);
  
  // Animation loop - rotate the model
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  // Simplified bottle model since we don't have an actual GLTF
  return (
    <group>
      {/* Bottle base */}
      <mesh ref={meshRef} position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[1, 1.2, 2, 32]} />
        <meshStandardMaterial color="#660000" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Bottle neck */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 0.8, 32]} />
        <meshStandardMaterial color="#580000" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Bottle cap */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.6, 32]} />
        <meshStandardMaterial color="#000000" metalness={0.7} roughness={0.2} />
      </mesh>
      
      {/* Decorative ring */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <torusGeometry args={[0.42, 0.05, 16, 32]} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
      </mesh>
    </group>
  );
};

export default PerfumeModel;