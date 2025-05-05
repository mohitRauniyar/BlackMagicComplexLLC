// import { useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import { Mesh } from 'three';

// const PerfumeModel = ({ rotationSpeed = 0.01 }) => {
//   const groupRef = useRef();

//   // Animate the entire bottle group
//   useFrame(() => {
//     if (groupRef.current) {
//       groupRef.current.rotation.y += rotationSpeed;
//     }
//   });

//   return (
//     <group ref={groupRef}>
//       {/* Bottle base - Glass */}
//       <mesh position={[0, -0.5, 0]} castShadow>
//         <cylinderGeometry args={[1, 1.2, 2, 64]} />
//         <meshPhysicalMaterial
//           color="#ffffff"
//           metalness={0}
//           roughness={0}
//           transmission={1}
//           thickness={1}
//           ior={1.45}
//           transparent={true}
//           opacity={1}
//           reflectivity={1}
//           clearcoat={1}
//           clearcoatRoughness={0}
//         />
//       </mesh>

//       {/* Bottle neck - Glass */}
//       <mesh position={[0, 1, 0]} castShadow>
//         <cylinderGeometry args={[0.3, 0.5, 0.8, 64]} />
//         <meshPhysicalMaterial
//           color="#ffffff"
//           metalness={0}
//           roughness={0}
//           transmission={1}
//           thickness={0.8}
//           ior={1.45}
//           transparent={true}
//           opacity={1}
//           reflectivity={1}
//           clearcoat={1}
//           clearcoatRoughness={0}
//         />
//       </mesh>

//       {/* Bottle cap - Black solid */}
//       <mesh position={[0, 1.7, 0]} castShadow>
//         <cylinderGeometry args={[0.4, 0.4, 0.6, 32]} />
//         <meshStandardMaterial color="#000000" metalness={0.7} roughness={0.2} />
//       </mesh>

//       {/* Decorative ring - Gold */}
//       <mesh position={[0, 1.35, 0]} castShadow>
//         <torusGeometry args={[0.42, 0.05, 16, 32]} />
//         <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
//       </mesh>
//     </group>
//   );
// };

// export default PerfumeModel;



import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Mesh } from 'three';

const PerfumeModel = ({ rotationSpeed = 0.003 }) => {
  const group = useRef<Mesh>(null);

  // Load the GLTF model
  const { scene } = useGLTF('/3dModels/sauvage_perfume.glb');

  let time = 0;

  useFrame((state, delta) => {
    if (group.current) {
      time += delta;
      group.current.rotation.y += rotationSpeed;
      group.current.rotation.z += rotationSpeed/3;
      // group.current.rotation.x = Math.sin(time) * 0.05; // gentle up-down rocking
    }
  });
  if(window.innerWidth >= 1200)
   return <primitive ref={group} object={scene} scale={11} position={[-1.8, 0, 0]} />;
  return <primitive ref={group} object={scene} scale={11} position={[0, 0, 0]} />;
};

export default PerfumeModel;
