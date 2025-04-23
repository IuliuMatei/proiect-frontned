import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Room } from './Room'; // Asigură-te că ai Room.tsx corect

const NUM_FLOORS = 11;
const NUM_ROOMS_PER_SIDE = 10;
const ROOM_SIZE = 1;
const ROOM_SPACING = 1.5;
const HALL_WIDTH = 4;
const FLOOR_HEIGHT = 3; // 🔥 Mărim distanța între etaje

const Building = () => {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas camera={{ position: [0, 15, 40], fov: 50 }}>
        {/* Lumină și control */}
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          autoRotate 
          autoRotateSpeed={0.7} 
          maxPolarAngle={Math.PI / 2} 
          minPolarAngle={Math.PI / 2} 
        />

        {/* Generare etaje */}
        {Array.from({ length: NUM_FLOORS }).map((_, floorIndex) => {
          const y = floorIndex * FLOOR_HEIGHT; // Fiecare etaj mai sus
          const floor = floorIndex + 1; // Etajul real

          return (
            <group key={floorIndex}>
              {/* Camere pe STÂNGA (side = "L") */}
              {Array.from({ length: NUM_ROOMS_PER_SIDE }).map((_, roomIndex) => {
                const z = roomIndex * ROOM_SPACING; // Distanța pe Z pentru camere
                const x = -(HALL_WIDTH / 2 + ROOM_SIZE / 2); // X negativ => STÂNGA

                return (
                  <Room
                    key={`left-${floorIndex}-${roomIndex}`}
                    position={[x, y, z]} // Camera pe STÂNGA
                    floor={floor}
                    roomNumber={roomIndex + 1}
                    side="L"
                  />
                );
              })}

              {/* Camere pe DREAPTA (side = "R") */}
              {Array.from({ length: NUM_ROOMS_PER_SIDE }).map((_, roomIndex) => {
                const z = roomIndex * ROOM_SPACING; // Distanța pe Z pentru camere
                const x = HALL_WIDTH / 2 + ROOM_SIZE / 2; // X pozitiv => DREAPTA

                return (
                  <Room
                    key={`right-${floorIndex}-${roomIndex}`}
                    position={[x, y, z]} // Camera pe DREAPTA
                    floor={floor}
                    roomNumber={roomIndex + 1}
                    side="R"
                  />
                );
              })}

              {/* Hol între camere */}
              <mesh position={[0, y, (NUM_ROOMS_PER_SIDE * ROOM_SPACING) / 2 - ROOM_SPACING / 2]}>
                <boxGeometry args={[HALL_WIDTH, 0.1, ROOM_SPACING * NUM_ROOMS_PER_SIDE]} />
                <meshStandardMaterial color="lightgray" opacity={0.7} transparent />
              </mesh>
            </group>
          );
        })}
      </Canvas>
    </div>
  );
};

export default Building;
