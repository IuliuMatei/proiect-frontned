// src/components/Carousel/Carousel.tsx

import { useEffect, useState } from "react";
import { useCamera } from "../Carosel/CameraContext"; // 🔥 Aduci CameraContext
import SensorData from "../../models/SensorData";
import ReturnGasValues from "../HomePage/components/ReturnGasValues";
import ReturnSmokeValues from "../HomePage/components/ReturnSmokeValues";
import ReturnTemperatureValue from "../HomePage/components/ReturnTemperatureValue";
import ReturnHumidityValue from "../HomePage/components/ReturnHumidityValue";
import ReturnFlameValue from "../HomePage/components/ReturnFlameValue";
import { SpinnerLoading } from "../Utils/SpinnerLoading";

export const Carousel = () => {
    const [sensor, setSensors] = useState<SensorData>();
    const [isLoading, setIsLoading] = useState(false);
    const [httpError, setHttpError] = useState<string | null>(null);

    const { selectedCamera } = useCamera(); // 🔥 Citește camera selectată

    useEffect(() => {
        if (!selectedCamera) return; // Nu facem nimic dacă nu există cameră

        const fetchSensor = async () => {
            setIsLoading(true);
            const { floor, roomNumber, side } = selectedCamera;
            const url: string = `http://localhost:8080/api/sensors/values?floor=${floor}&roomNumber=${roomNumber}&side=${side}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Something went wrong while fetching sensor data!");
                }

                const responseData = await response.json();

                const loadedSensor: SensorData = {
                    id: 1,
                    gasSensor: responseData.gasSensor,
                    smokeSensor: responseData.smokeSensor,
                    temperatureSensor: responseData.temperatureSensor,
                    humiditySensor: responseData.humiditySensor,
                    flameSensor: responseData.flameSensor,
                    createdAt: new Date().toISOString()
                };

                setSensors(loadedSensor);
                setIsLoading(false);
            } catch (error: any) {
                setIsLoading(false);
                setHttpError(error.message);
            }
        };

        fetchSensor();
    }, [selectedCamera]); // 🔥 Se apelează când selectezi altă cameră

    if (!selectedCamera) {
        return (
            <div className="container m-5 text-center">
                <h4>Selectează o cameră pentru a vedea valorile senzorilor!</h4>
            </div>
        );
    }

    if (isLoading) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p className="text-danger">{httpError}</p>
            </div>
        );
    }

    return (
        <div className="container mt-5" style={{ height: 550 }}>
            <div id="carouselExampleControls" className="carousel carousel-dark slide mt-5 d-none d-lg-block" data-bs-interval="false">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <h3 className="text-center">Gas sensor value</h3>
                        <div className="row d-flex justify-content-center align-items-center">
                            {sensor && <ReturnGasValues values={sensor} />}
                        </div>
                    </div>
                    <div className="carousel-item">
                        <h3 className="text-center">Smoke sensor value</h3>
                        <div className="row d-flex justify-content-center align-items-center">
                            {sensor && <ReturnSmokeValues values={sensor} />}
                        </div>
                    </div>
                    <div className="carousel-item">
                        <h3 className="text-center">Temperature sensor value</h3>
                        <div className="row d-flex justify-content-center align-items-center">
                            {sensor && <ReturnTemperatureValue values={sensor} />}
                        </div>
                    </div>
                    <div className="carousel-item">
                        <h3 className="text-center">Humidity sensor value</h3>
                        <div className="row d-flex justify-content-center align-items-center">
                            {sensor && <ReturnHumidityValue values={sensor} />}
                        </div>
                    </div>
                    <div className="carousel-item">
                        <h3 className="text-center">Flame sensor value</h3>
                        <div className="row d-flex justify-content-center align-items-center">
                            {sensor && <ReturnFlameValue values={sensor} />}
                        </div>
                    </div>
                </div>

                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
};

export default Carousel;
