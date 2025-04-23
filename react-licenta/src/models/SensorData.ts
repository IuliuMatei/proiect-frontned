class SensorData{
    id: number;
    gasSensor: number;
    smokeSensor: number;
    temperatureSensor: number;
    humiditySensor: number;
    flameSensor: boolean;
    createdAt: string;

    constructor(
        id: number,
        gasSensor: number,
        smokeSensor: number,
        temperatureSensor: number,
        humiditySensor: number,
        flameSensor: boolean,
        createdAt: string
    ) {
        this.id = id;
        this.gasSensor = gasSensor;
        this.smokeSensor = smokeSensor;
        this.temperatureSensor = temperatureSensor;
        this.humiditySensor = humiditySensor;
        this.flameSensor = flameSensor;
        this.createdAt = createdAt;
    }
}

export default SensorData;