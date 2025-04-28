import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useState, useEffect } from 'react';
import SensorData from '../../models/SensorData';

const rooms = Array.from({ length: 5 }, (_, floor) =>
  ['N', 'S'].flatMap((side) =>
    Array.from({ length: 4 }, (_, room) => ({
      id: `${floor + 1}${side}${room + 1}`,
      floor: floor + 1,
      side,
      roomNumber: room + 1,
    }))
  )
).flat();

type RoomProps = {
  position: [number, number, number];
  label: string;
  side: string;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovering: boolean) => void;
};

const Room = ({ position, label, side, isSelected, isHovered, onClick, onHover }: RoomProps) => {
  const color = isSelected ? 'green' : isHovered ? 'lightgreen' : 'skyblue';

  // ✨ Poziție și rotație text în funcție de N/S
  const textPosition = side === 'N' ? [-1.5, 0, 0] : [1.5, 0, 0];
  const textRotation = side === 'N' ? [0, Math.PI / 2, 0] : [0, -Math.PI / 2, 0];

  return (
    <group position={position}>
      <mesh
        onClick={onClick}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
      >
        <boxGeometry args={[2.5, 1.5, 2.5]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <Text
        position={textPosition as any}
        rotation={textRotation as any}
        fontSize={0.5}
        color="black"
        anchorX="center"
        anchorY="middle"
        userData={{ clickable: false }}
      >
        {label}
      </Text>
    </group>
  );
};

export default function BuildingPage() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);

  useEffect(() => {
    if (selectedRoom) {
      const floor = parseInt(selectedRoom[0]);
      const side = selectedRoom[1];
      const roomNumber = parseInt(selectedRoom[2]);

      fetch(`http://localhost:8080/api/sensors/values?floor=${floor}&roomNumber=${roomNumber}&side=${side}`)
        .then((res) => res.json())
        .then((data) => setSensorData(data))
        .catch(console.error);
    }
  }, [selectedRoom]);

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        {/* Stânga: Clădirea 3D */}
        <div className="col-6 p-0 bg-light" style={{ height: '100vh' }}>
          <Canvas camera={{ position: [0, 20, 40], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 20, 10]} intensity={1} />

            {rooms.map((room, index) => {
              const x = room.side === 'N' ? -6 : 6;
              const y = room.floor * 4 - 10;
              const z = (room.roomNumber - 2.5) * 5;
              const roomId = `${room.floor}${room.side}${room.roomNumber}`;
              const label = `${room.roomNumber}${room.side}`;

              return (
                <Room
                  key={index}
                  position={[x, y, z]}
                  label={label}
                  side={room.side}
                  isSelected={selectedRoom === roomId}
                  isHovered={hoveredRoom === roomId}
                  onClick={() => setSelectedRoom(roomId)}
                  onHover={(hovering) => setHoveredRoom(hovering ? roomId : null)}
                />
              );
            })}

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              rotateSpeed={1}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </div>

        {/* Dreapta: Datele senzorilor */}
        <div className="col-6 d-flex align-items-center justify-content-center bg-white" style={{ height: '100vh' }}>
          {sensorData ? (
            <div className="text-center">
              <h2 className="display-6 mb-4">Camera selectată: {selectedRoom}</h2>
              <div className="text-start">
                <p><strong>Temperatură:</strong> {sensorData.temperatureSensor} °C</p>
                <p><strong>Umiditate:</strong> {sensorData.humiditySensor} %</p>
                <p><strong>TVOC:</strong> {sensorData.tvoc} ppb</p>
                <p><strong>eCO₂:</strong> {sensorData.eCO2} ppm</p>
                <p><strong>H₂ brut:</strong> {sensorData.rawH2}</p>
                <p><strong>Eth brut:</strong> {sensorData.rawEth}</p>
                <p><strong>Sensor MQ2:</strong> {sensorData.mq2Sensor}</p>
                <p><strong>Etaj:</strong> {sensorData.floor}</p>
                <p><strong>Număr cameră:</strong> {sensorData.roomNumber}</p>
                <p><strong>Parte:</strong> {sensorData.side}</p>
                <p><strong>Foc detectat:</strong> {sensorData.foc ? "Da" : "Nu"}</p>
              </div>
            </div>
          ) : (
            <h4 className="text-muted">Selectează o cameră!</h4>
          )}
        </div>
      </div>
    </div>
  );
}
