import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
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

type RoomStatus = {
  hasFire: boolean;
  hasGas: boolean;
};

type RoomProps = {
  position: [number, number, number];
  label: string;
  side: string;
  isSelected: boolean;
  isHovered: boolean;
  status: RoomStatus;
  onClick: () => void;
  onHover: (hovering: boolean) => void;
};

const Room = ({ position, label, side, isSelected, isHovered, status, onClick, onHover }: RoomProps) => {
  let color = 'skyblue';
  if (status.hasFire) color = 'red';
  else if (status.hasGas) color = 'yellow';
  if (isSelected) color = 'green';
  else if (isHovered) color = 'lightgreen';

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
  const [sensorHistory, setSensorHistory] = useState<SensorData[]>([]);
  const [roomStatusMap, setRoomStatusMap] = useState<Record<string, RoomStatus>>({});

  useEffect(() => {
    const fetchStatuses = async () => {
      const status: Record<string, RoomStatus> = {};

      await Promise.all(rooms.map(async (room) => {
        const { floor, roomNumber, side } = room;
        const roomId = `${floor}${side}${roomNumber}`;

        try {
          const res = await fetch(`http://localhost:8080/api/sensors/values?floor=${floor}&roomNumber=${roomNumber}&side=${side}`);
          const data = await res.json();
          status[roomId] = {
            hasFire: data.foc === 1,
            hasGas: data.mq2Sensor > 100
          };
        } catch (error) {
          console.error(`Eroare la camera ${roomId}:`, error);
          status[roomId] = { hasFire: false, hasGas: false };
        }
      }));

      setRoomStatusMap(status);
    };

    fetchStatuses();
    const interval = setInterval(fetchStatuses, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      const match = selectedRoom.match(/^(\d)([NS])(\d)$/);
      if (!match) return;

      const [, floorStr, side, roomStr] = match;
      const floor = parseInt(floorStr);
      const roomNumber = parseInt(roomStr);

      fetch(`http://localhost:8080/api/sensors/values?floor=${floor}&roomNumber=${roomNumber}&side=${side}`)
        .then((res) => res.json())
        .then((data) => setSensorData(data))
        .catch(console.error);

      fetch(`http://localhost:8080/api/sensors/valuesLastHour?floor=${floor}&roomNumber=${roomNumber}&side=${side}`)
        .then((res) => res.json())
        .then((data) => setSensorHistory(data))
        .catch(console.error);
    }
  }, [selectedRoom]);

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
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
              const status = roomStatusMap[roomId] || { hasFire: false, hasGas: false };

              return (
                <Room
                  key={index}
                  position={[x, y, z]}
                  label={label}
                  side={room.side}
                  isSelected={selectedRoom === roomId}
                  isHovered={hoveredRoom === roomId}
                  status={status}
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

        <div className="col-6 d-flex flex-column align-items-center bg-white" style={{ height: '100vh', overflowY: 'auto' }}>
          {sensorData ? (
            <>
              <div className="text-center mt-4">
                <h2 className="display-6 mb-4">Camera selectată: {selectedRoom}</h2>
                <div className="text-start small">
                  <p><strong>Temperatură:</strong> {sensorData.temperatureSensor} °C</p>
                  <p><strong>Umiditate:</strong> {sensorData.humiditySensor} %</p>
                  <p><strong>TVOC:</strong> {sensorData.tvoc} ppb</p>
                  <p><strong>eCO₂:</strong> {sensorData.eCO2} ppm</p>
                  <p><strong>H₂ brut:</strong> {sensorData.rawH2}</p>
                  <p><strong>Eth brut:</strong> {sensorData.rawEth}</p>
                  <p><strong>Sensor MQ2:</strong> {sensorData.mq2Sensor}</p>
                  <p><strong>Foc detectat:</strong> {sensorData.foc ? "Da" : "Nu"}</p>
                </div>
              </div>

              {sensorHistory.length > 0 && (
                <div className="w-100 p-3">
                  <Carousel
                    showThumbs={false}
                    showStatus={false}
                    infiniteLoop
                    autoPlay
                    interval={5000}
                    dynamicHeight={false}
                  >
                    {renderChart(sensorHistory, 'temperatureSensor', 'Temperatură (°C)', '#8884d8')}
                    {renderChart(sensorHistory, 'humiditySensor', 'Umiditate (%)', '#82ca9d')}
                    {renderChart(sensorHistory, 'tvoc', 'TVOC (ppb)', '#ffc658')}
                    {renderChart(sensorHistory, 'eCO2', 'eCO₂ (ppm)', '#ff7300')}
                    {renderChart(sensorHistory, 'mq2Sensor', 'Sensor MQ2', '#00c49f')}
                  </Carousel>
                </div>
              )}
            </>
          ) : (
            <h4 className="text-muted mt-5">Selectează o cameră!</h4>
          )}
        </div>
      </div>
    </div>
  );
}

function renderChart(data: SensorData[], dataKey: keyof SensorData, label: string, color: string) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis
          dataKey="dateTime"
          tickFormatter={(str) => new Date(str).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          minTickGap={20}
        />
        <YAxis />
        <Tooltip labelFormatter={(label) => new Date(label).toLocaleTimeString()} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
