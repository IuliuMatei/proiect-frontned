import React from "react";
import SensorData from "../../../models/SensorData";

export const ReturnFlameValue: React.FC<{ values: SensorData }> = (props) => {
    const maxValue = 400; // Valoarea maximă a senzorului
    let percentage;
    if (props.values.flameSensor == true){
        percentage = 100;
    } else {
        percentage = 0;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
                style={{
                    width: "40px", // Lățimea barei
                    height: "200px", // Înălțimea totală
                    backgroundColor: "#ddd", // Culoarea de fundal
                    borderRadius: "10px",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: `${percentage}%`, // Umplerea de jos în sus
                        backgroundColor: "red", // Culoarea de umplere
                        position: "absolute",
                        bottom: 0, // Se umple de jos în sus
                        transition: "height 0.5s ease-in-out",
                    }}
                />
            </div>
            <p style={{ marginTop: "10px", fontWeight: "bold" }}>{props.values.flameSensor}</p>
        </div>
    );
};

export default ReturnFlameValue;
