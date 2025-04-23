// src/layouts/Carosel/ValuesDash.tsx

import React from 'react';
import { useOktaAuth } from '@okta/okta-react';
import Building from '../Building/Building'; // 🔥 Import Building-ul 3D

const ValuesDash = () => {
  const { authState } = useOktaAuth();

  if (!authState) {
    return <div>Loading...</div>; // 🔒 Dacă nu ești autentificat, încărcare
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Management Cămin - Dashboard</h2>

      {/* 🔥 Building 3D, click pe camere */}
      <div style={{ height: "600px", marginBottom: "30px" }}>
        <Building />
      </div>

      {/* ❌ NU punem aici Carousel-ul! */}
      {/* Când dai click pe o cameră în Building, faci REDIRECT automat către /sensor-values */}
    </div>
  );
};

export default ValuesDash;
