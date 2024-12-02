import React, { useEffect, useRef, useState } from 'react';

// Компонент для отображения видео с камеры
const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const getCamera = async () => {
      try {
        // Запрашиваем доступ к камере
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true, // запросить только видеопоток
        });

        // Если видео элемент существует, устанавливаем поток
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera", error);
        setHasError(true);
      }
    };

    getCamera();

    // Очищаем поток, когда компонент размонтируется
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop()); // остановка потоков
      }
    };
  }, []);

  return (
    <div>
      <h1>Видео с камеры</h1>
      {hasError ? (
        <p>Ошибка доступа к камере.</p>
      ) : (
        <video ref={videoRef} autoPlay playsInline width="100%" height="auto" />
      )}
    </div>
  );
};

export default App;
