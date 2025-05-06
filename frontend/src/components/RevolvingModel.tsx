import React from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Mesh } from 'three';

const RevolvingModel = ({
  modelPath,
  scale = 11,
  initialOffset = [0, 0, 0],
  rotationSpeed = 0.003,
  revolutionRadius = 1,
  revolutionSpeed = 0.2,
  floating = false,
  initialAngle = 45,
  initialRotationAngle = 0
}) => {
  const group = useRef<Mesh>(null);
  const { scene } = useGLTF(modelPath);

  let angle = initialAngle;
  let i = 0;
  useFrame((state, delta) => {
    if (group.current) {
      // Self rotation
      if(i===0)
        group.current.rotation.y +=initialRotationAngle;
      
      i = 1;
      group.current.rotation.y += rotationSpeed * 1.5;
      group.current.rotation.z += rotationSpeed / 10;

      // Revolution (circular movement around initialOffset)
      angle += delta * revolutionSpeed;
      const x = Math.cos(angle) * revolutionRadius + initialOffset[0];
      const z = Math.sin(angle) * revolutionRadius + initialOffset[2];
      const y = floating ? Math.sin(angle * 2) * 0.2 + initialOffset[1] : initialOffset[1];
      group.current.position.set(x, y, z);
      // group.current.rotation.y -=initialRotationAngle;
    }
  });

  return <primitive ref={group} object={scene} scale={scale} />;
};

export default RevolvingModel;
