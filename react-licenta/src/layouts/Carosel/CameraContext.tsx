import { createContext, useContext, useState, ReactNode } from 'react';

interface SelectedCamera {
  floor: number;
  roomNumber: number;
  side: 'L' | 'R';
}

interface CameraContextType {
  selectedCamera: SelectedCamera | null;
  setSelectedCamera: (camera: SelectedCamera) => void;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const CameraProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCamera, setSelectedCamera] = useState<SelectedCamera | null>(null);

  return (
    <CameraContext.Provider value={{ selectedCamera, setSelectedCamera }}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
};
