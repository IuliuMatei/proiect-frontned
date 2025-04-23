// src/components/Building/Room.tsx

import React, { useState } from 'react';
import { useCamera } from "../Carosel/CameraContext"; // 🔥 Aduci CameraContext
import { Billboard, Text } from '@react-three/drei';
import { useHistory } from 'react-router-dom'; // 🔥 Import useHistory pentru redirect

interface RoomProps {
  position: [number, number, number];
  floor: number;
  roomNumber: number;
  side: "L" | "R";
}

export const Room: React.FC<RoomProps> = ({ position, floor, roomNumber, side }) => {
  const [hovered, setHovered] = useState(false);
  const { setSelectedCamera } = useCamera();
  const history = useHistory(); // 🔥 Hook pentru navigare

  const handleClick = () => {
    console.log(`Clicked on Camera - Floor: ${floor}, Room: ${roomNumber}, Side: ${side}`);
    setSelectedCamera({ floor, roomNumber, side }); // ✅ Setăm camera selectată
    history.push('/sensor-values');                  // ✅ Redirect către pagina Carousel
  };

  return (
    <group
      position={position}
      onClick={handleClick} // 🔥 Click pe cameră
    >
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
        scale={hovered ? 1.2 : 1}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? "orange" : "skyblue"} />
      </mesh>

      <Billboard>
        <Text
          position={[0, 0, 0.6]}
          fontSize={0.35}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {`${floor}${side}${roomNumber}`}
        </Text>
      </Billboard>
    </group>
  );
};
