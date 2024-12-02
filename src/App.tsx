import React, { useEffect, useRef } from 'react';

const CameraAccess: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null); // Ссылка на элемент video

  useEffect(() => {
    // Запрашиваем доступ к камере
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        // Если доступ получен, подключаем поток к видео элементу
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error('Ошибка доступа к камере:', error);
      });
    
    // Останавливаем поток при размонтировании компонента
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop()); // Останавливаем все треки
      }
    };
  }, []);

  return (
    <div>
      <h1>Доступ к камере</h1>
      <video ref={videoRef} autoPlay></video> {/* Видео с потоком камеры */}
    </div>
  );
};

export default CameraAccess;
