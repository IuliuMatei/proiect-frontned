class SensorData {
    id: number;
    dateTime: string;
    temperatureSensor: number;
    humiditySensor: number;
    tvoc: number;
    eCO2: number;
    rawH2: number;
    rawEth: number;
    mq2Sensor: number;
    floor: number;
    roomNumber: number;
    side: string;
    foc: number;
  
    constructor(
      id: number,
      dateTime: string,
      temperatureSensor: number,
      humiditySensor: number,
      tvoc: number,
      eCO2: number,
      rawH2: number,
      rawEth: number,
      mq2Sensor: number,
      floor: number,
      roomNumber: number,
      side: string,
      foc: number
    ) {
      this.id = id;
      this.dateTime = dateTime;
      this.temperatureSensor = temperatureSensor;
      this.humiditySensor = humiditySensor;
      this.tvoc = tvoc;
      this.eCO2 = eCO2;
      this.rawH2 = rawH2;
      this.rawEth = rawEth;
      this.mq2Sensor = mq2Sensor;
      this.floor = floor;
      this.roomNumber = roomNumber;
      this.side = side;
      this.foc = foc;
    }
  }
  
  export default SensorData;
  