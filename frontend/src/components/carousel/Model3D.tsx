import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type ModelProps = {
  color: string;
  wireframe?: boolean;
  type: "cube" | "sphere" | "torus" | "cone" | "cylinder";
  source?: string;
};

const Shape: React.FC<ModelProps> = ({ color, wireframe = false, type, source }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (source) {
      const loader = new GLTFLoader();
      loader.load(
        source,
        (gltf) => {
          const scene = gltf.scene;
  
          // Get bounding box info
          const box = new THREE.Box3().setFromObject(scene);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
  
          // Center the model at origin
          scene.position.sub(center);
  
          // Adjust camera distance and height
          const maxDim = Math.max(size.x, size.y, size.z);
          const fov = camera.fov * (Math.PI / 180);
          const distance = maxDim / (2 * Math.tan(fov / 2));
  
          camera.position.set(0, center.y+1, distance * 2.5); // align vertically
          camera.lookAt(0, 0, 0);
          camera.updateProjectionMatrix();
  
          setModel(scene);
        },
        undefined,
        (error) => {
          console.error("Error loading 3D model:", error);
        }
      );
    }
  }, [source, camera]);
  

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
    if (model) {
      model.rotation.y += 0.005;
    }
  });

  if (source && model) {
    return <primitive object={model} scale={1.5} />;
  }

  const getGeometry = () => {
    switch (type) {
      case "cube":
        return <boxGeometry args={[1.5, 1.5, 1.5]} />;
      case "sphere":
        return <sphereGeometry args={[1, 32, 32]} />;
      case "torus":
        return <torusGeometry args={[1, 0.4, 16, 32]} />;
      case "cone":
        return <coneGeometry args={[1, 2, 32]} />;
      case "cylinder":
        return <cylinderGeometry args={[1, 1, 2, 32]} />;
      default:
        return <boxGeometry args={[1.5, 1.5, 1.5]} />;
    }
  };

  return (
    <mesh ref={meshRef}>
      {getGeometry()}
      <meshStandardMaterial color={color} wireframe={wireframe} />
    </mesh>
  );
};

const Model3D: React.FC<ModelProps> = ({ color, wireframe, type, source }) => {
  return (
    <div className="h-[400px] lg:h-[600px] w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={2} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <pointLight position={[-5, -5, -5]} intensity={1.5} />
        <Shape color={color} wireframe={wireframe} type={type} source={source} />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Model3D;
