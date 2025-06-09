import React from "react";

export const About = () => {
    return (
        <div className="container mt-5">
            <h1 className="mb-4">About the Platform</h1>

            <p>
                This platform was developed as a real-time monitoring system for residential buildings in order to detect gas leaks and fire hazards
                as early as possible. It provides users and emergency responders with live sensor data and an interactive 3D interface to visualize
                the condition of each room in the building. This greatly enhances building safety, supports faster evacuation decisions, and reduces false alarms.
            </p>

            <h3 className="mt-4">How It Works</h3>
            <p>
                Each room is equipped with multiple environmental sensors connected to an <strong>ESP32 microcontroller</strong>. These sensors monitor temperature,
                humidity, gas concentration, and air quality parameters. The ESP32 collects these values and sends them via a <strong>REST API</strong> built with
                <strong> Spring Boot</strong> to a central server. The data is then processed and displayed in a web interface.
                An AI-based prediction algorithm (an <strong>LSTM neural network</strong>) continuously analyzes this time-series data to predict the risk of fire.
            </p>

            <h3 className="mt-4">Live Data Display</h3>
            <p>
                The platform’s interface shows a 3D model of the building (created using <strong>@react-three/fiber</strong>), where each room has a dynamic color
                depending on its safety status:
            </p>
            <ul>
                <li><strong>Green:</strong> Selected room</li>
                <li><strong>Light green:</strong> Hovered room</li>
                <li><strong>Yellow:</strong> Gas threshold exceeded (warning)</li>
                <li><strong>Red:</strong> Fire detected (critical)</li>
            </ul>
            <p>
                When a room is clicked, the following sensor values are shown in real time:
            </p>

            <h4 className="mt-3">Sensor Values Explained:</h4>
            <ul>
                <li>
                    <strong>Temperature (°C):</strong> Measures ambient heat levels. Abnormally high values may indicate overheating or fire.
                </li>
                <li>
                    <strong>Humidity (%):</strong> Helps assess environmental stability. High humidity may suppress fire, while dry conditions increase fire risk.
                </li>
                <li>
                    <strong>TVOC (Total Volatile Organic Compounds - ppb):</strong> Indicates the level of airborne chemical pollutants. High TVOC may signal
                    smoke, chemicals, or poor ventilation.
                </li>
                <li>
                    <strong>eCO₂ (Equivalent CO₂ - ppm):</strong> Estimated carbon dioxide concentration, often correlated with occupancy or combustion.
                </li>
                <li>
                    <strong>Crude H₂:</strong> Raw concentration of hydrogen gas, a flammable element. High levels may indicate gas leaks.
                </li>
                <li>
                    <strong>Crude Eth (Ethanol):</strong> Measures alcohol vapor, which can originate from cleaning products or indicate flammable presence.
                </li>
                <li>
                    <strong>Gas:</strong> A combined estimate from the MQ-2 sensor, detecting flammable gases like methane, butane, LPG, and smoke.
                </li>
                <li>
                    <strong>Fire Detected:</strong> A boolean output from the AI model that indicates whether a fire is highly probable based on current sensor trends.
                </li>
            </ul>

            <h3 className="mt-4">Technology Stack</h3>
            <ul>
                <li><strong>ESP32:</strong> Microcontroller for reading sensor data and sending it to the API</li>
                <li><strong>Sensors:</strong> MQ-2 (gas/smoke), SGP30 (TVOC and eCO₂), SHT21 (temperature and humidity)</li>
                <li><strong>Spring Boot:</strong> Java framework for backend API and logic</li>
                <li><strong>React + @react-three/fiber:</strong> Web interface and 3D visualization</li>
                <li><strong>Recharts:</strong> For live charts displaying value trends</li>
                <li><strong>Okta:</strong> User authentication system</li>
                <li><strong>Python (LSTM):</strong> AI model for real-time fire prediction</li>
            </ul>

            <h3 className="mt-4">Why This Platform Matters</h3>
            <p>
                Traditional fire alarms alert users only after smoke is detected, often without indicating where the fire is or what triggered the alarm.
                This platform not only detects anomalies earlier, but also provides a clear view of the affected areas, sensor behavior over time, and
                leverages artificial intelligence to reduce false alarms and increase response accuracy.
            </p>

            <p className="mt-4">
                By combining hardware, software, and AI, this system offers a scalable, modern, and life-saving solution for building safety.
            </p>
        </div>
    );
};
