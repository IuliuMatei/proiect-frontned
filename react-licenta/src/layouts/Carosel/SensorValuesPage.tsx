// src/pages/SensorValuesPage.tsx

import React, { useEffect } from 'react';
import { useCamera } from './CameraContext';
import { useHistory } from 'react-router-dom';
import Carousel from './Carosel';
import { SelectedCameraInfo } from './SelectedCameraInfo';

const SensorValuesPage = () => {
  const { selectedCamera } = useCamera();
  const history = useHistory();

  useEffect(() => {
    if (!selectedCamera) {
      history.push('/values'); // 🔥 Dacă nu e selectată nicio cameră, întoarcem la building
    }
  }, [selectedCamera, history]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Valori Senzori Cameră</h2>
      <SelectedCameraInfo />
      <Carousel />
    </div>
  );
};

export default SensorValuesPage;
