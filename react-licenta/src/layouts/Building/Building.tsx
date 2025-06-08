import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import SensorData from '../../models/SensorData';

/* --------------------------------------------------
   Helpers & constants
-------------------------------------------------- */

const rooms = Array.from({ length: 5 }, (_, floor) =>
  ['N', 'S'].flatMap((side) =>
    Array.from({ length: 4 }, (_, room) => ({
      id: `${floor + 1}${side}${room + 1}`,
      floor: floor + 1,
      side,
      roomNumber: room + 1,
    })),
  ),
).flat();

/* --------------------------------------------------
   Types
-------------------------------------------------- */

type RoomStatus = { hasFire: boolean; hasGas: boolean };

interface RoomProps {
  position: [number, number, number];
  label: string;
  isSelected: boolean;
  isHovered: boolean;
  status: RoomStatus;
  onClick: () => void;
  onHover: (h: boolean) => void;
}

/* --------------------------------------------------
   Room component
-------------------------------------------------- */

const Room = ({
  position,
  label,
  isSelected,
  isHovered,
  status,
  onClick,
  onHover,
}: RoomProps) => {
  const [x] = position; // ­­x < 0 → N · x > 0 → S

  /* colour */
  let color = 'skyblue';
  if (status.hasFire) color = 'red';
  else if (status.hasGas) color = 'yellow';
  if (isSelected) color = 'green';
  else if (isHovered) color = 'lightgreen';

  /* label on interior face (toward corridor) */
  const labelPos: [number, number, number] = x < 0 ? [-1.4, 0, 0] : [1.4, 0, 0];
  const labelRot: [number, number, number] = x < 0 ? [0, -Math.PI / 2, 0] : [0, Math.PI / 2, 0];

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
        position={labelPos}
        rotation={labelRot}
        fontSize={0.5}
        color='black'
        anchorX='center'
        anchorY='middle'
        userData={{ clickable: false }}
      >
        {label}
      </Text>
    </group>
  );
};

/* --------------------------------------------------
   Main component
-------------------------------------------------- */

export default function BuildingPage() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [sensorHistory, setSensorHistory] = useState<SensorData[]>([]);
  const [roomStatusMap, setRoomStatusMap] = useState<
    Record<string, RoomStatus>
  >({});

  /* live status for all rooms */
  useEffect(() => {
    const fetchStatuses = async () => {
      const status: Record<string, RoomStatus> = {};

      await Promise.all(
        rooms.map(async ({ floor, side, roomNumber }) => {
          const roomId = `${floor}${side}${roomNumber}`;
          try {
            const res = await fetch(
              `http://localhost:8080/api/sensors/values?floor=${floor}&roomNumber=${roomNumber}&side=${side}`,
            );
            const data = await res.json();
            status[roomId] = {
              hasFire: data.foc === 1,
              hasGas: data.mq2Sensor > 100,
            };
          } catch {
            status[roomId] = { hasFire: false, hasGas: false };
          }
        }),
      );

      setRoomStatusMap(status);
    };

    fetchStatuses();
    const id = setInterval(fetchStatuses, 5000);
    return () => clearInterval(id);
  }, []);

  /* selected room data */
  useEffect(() => {
    if (!selectedRoom) return;
    const m = selectedRoom.match(/^(\d)([NS])(\d)$/);
    if (!m) return;
    const [, f, s, r] = m;
    const floor = +f;
    const side = s;
    const roomNumber = +r;

    fetch(
      `http://localhost:8080/api/sensors/values?floor=${floor}&roomNumber=${roomNumber}&side=${side}`,
    )
      .then((r) => r.json())
      .then(setSensorData)
      .catch(console.error);

    fetch(
      `http://localhost:8080/api/sensors/valuesLastHour?floor=${floor}&roomNumber=${roomNumber}&side=${side}`,
    )
      .then((r) => r.json())
      .then(setSensorHistory)
      .catch(console.error);
  }, [selectedRoom]);

  const floorLabels = ['Etaj 5', 'Etaj 4', 'Etaj 3', 'Etaj 2', 'Etaj 1'];

  /* -------------------------------------------------- */
  return (
    <div className='container-fluid h-100'>
      <div className='row h-100'>
        {/* 3D column */}
        <div
          className='col-6 p-0 bg-light position-relative'
          style={{ height: '100vh' }}
        >
          {/* title */}
          <h3
            className='w-100 text-center position-absolute'
            style={{ top: 5, pointerEvents: 'none', zIndex: 10 }}
          >
            Camin Leu A
          </h3>

{[1, 2, 3, 4, 5].map((f) => {
  const topPercent = 70 - (f - 1) * 13;   //  Etaj 1 → 86 %,  Etaj 5 → 6 %
  return (
    <span
      key={f}
      className='position-absolute'
      style={{
        left: 60,
        top: `${topPercent}%`,
        transform: 'translateY(-50%)',
        fontWeight: 600,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      {`Floor ${f}`}
    </span>
  );
})}

          {/* 3-D scene */}
          <Canvas camera={{ position: [0, 20, 40], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 20, 10]} intensity={1} />

            {rooms.map((room) => {
              const x = room.side === 'N' ? -6 : 6;
              const y = room.floor * 4 - 10;
              const z = (room.roomNumber - 2.5) * 5;
              const roomId = room.id;
              const label = `${room.roomNumber}${room.side}`;
              const status =
                roomStatusMap[roomId] || { hasFire: false, hasGas: false };

              return (
                <Room
                  key={roomId}
                  position={[x, y, z]}
                  label={label}
                  isSelected={selectedRoom === roomId}
                  isHovered={hoveredRoom === roomId}
                  status={status}
                  onClick={() => setSelectedRoom(roomId)}
                  onHover={(h) => setHoveredRoom(h ? roomId : null)}
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

        {/* right column – sensors */}
        <div
          className='col-6 d-flex flex-column align-items-center bg-white'
          style={{ height: '100vh', overflowY: 'auto' }}
        >
          {sensorData ? (
            <>
              <div className='text-center mt-4'>
                <h4 className='mb-4'>Camera selectată: {selectedRoom}</h4>
                <div className='text-start small'>
                  <p>
                    <strong>Temperature:</strong> {sensorData.temperatureSensor}{' '}
                    °C
                  </p>
                  <p>
                    <strong>Humidity:</strong> {sensorData.humiditySensor} %
                  </p>
                  <p>
                    <strong>TVOC:</strong> {sensorData.tvoc} ppb
                  </p>
                  <p>
                    <strong>eCO₂:</strong> {sensorData.eCO2} ppm
                  </p>
                  <p>
                    <strong>Crude H₂:</strong> {sensorData.rawH2}
                  </p>
                  <p>
                    <strong>Crude Eth:</strong> {sensorData.rawEth}
                  </p>
                  <p>
                    <strong>Gas:</strong> {sensorData.mq2Sensor}
                  </p>
                  <p>
                    <strong>Fire detected:</strong>{' '}
                    {sensorData.foc ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>

              {sensorHistory.length > 0 && (
                <div className='w-100 p-3'>
                  <Carousel
                    showThumbs={false}
                    showStatus={false}
                    infiniteLoop
                    autoPlay
                    interval={5000}
                    dynamicHeight={false}
                  >
                    {renderChart(
                      sensorHistory,
                      'temperatureSensor',
                      'Temperature (°C)',
                      '#8884d8',
                    )}
                    {renderChart(
                      sensorHistory,
                      'humiditySensor',
                      'Humidity (%)',
                      '#82ca9d',
                    )}
                    {renderChart(sensorHistory, 'tvoc', 'TVOC (ppb)', '#ffc658')}
                    {renderChart(
                      sensorHistory,
                      'eCO2',
                      'eCO₂ (ppm)',
                      '#ff7300',
                    )}
                    {renderChart(
                      sensorHistory,
                      'rawEth',
                      'Crude Ethanol',
                      '#ff7300',
                    )}
                    {renderChart(
                      sensorHistory,
                      'rawH2',
                      'Crude H₂',
                      '#ff7300',
                    )}
                    {renderChart(
                      sensorHistory,
                      'mq2Sensor',
                      'Gas',
                      '#00c49f',
                    )}
                  </Carousel>
                </div>
              )}
            </>
          ) : (
            <h4 className='text-muted mt-5'>Choose a room!</h4>
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   Utility – chart renderer
-------------------------------------------------- */

function renderChart(
  data: SensorData[],
  dataKey: keyof SensorData,
  label: string,
  color: string,
) {
  return (
    <div key={dataKey as string} className='px-2'>
      <h6 className='text-center mb-2'>{label}</h6>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={data} margin={{ top: 20, right: 20, bottom: 0, left: 5 }}>
          <XAxis
            dataKey='dateTime'
            tickFormatter={(s) =>
              new Date(s).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            }
            minTickGap={20}
          />
          <YAxis />
          <Tooltip labelFormatter={(l) => new Date(l).toLocaleTimeString()} />
          <Line
            type='monotone'
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
