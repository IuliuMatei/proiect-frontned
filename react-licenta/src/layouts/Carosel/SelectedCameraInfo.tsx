// src/components/Building/SelectedCameraInfo.tsx

import { useCamera } from '../Carosel/CameraContext'; // 🔥 Folosește CameraContext

export const SelectedCameraInfo = () => {
  const { selectedCamera } = useCamera(); // ✅ Citește camera selectată

  if (!selectedCamera) {
    return (
      <div className="text-center mt-3">
        <h5>Selectează o cameră!</h5> {/* Dacă nu ai selectat cameră */}
      </div>
    );
  }

  return (
    <div className="text-center mt-3">
      <h5>Camera Selectată:</h5>
      <p><strong>Etaj:</strong> {selectedCamera.floor}</p>
      <p><strong>Camera:</strong> {selectedCamera.roomNumber}</p>
      <p><strong>Partea:</strong> {selectedCamera.side}</p>
    </div>
  );
};
