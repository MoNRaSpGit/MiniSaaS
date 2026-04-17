import { useEffect, useMemo, useRef, useState } from "react";

export function FacialView() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState("Listo para reconocimiento facial.");
  const [personName, setPersonName] = useState("Cliente");
  const [greeting, setGreeting] = useState("");

  const faceDetectorSupported = useMemo(
    () => typeof window !== "undefined" && "FaceDetector" in window,
    []
  );

  const stopFacial = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsRunning(false);
  };

  const startFacial = async () => {
    setGreeting("");
    if (!faceDetectorSupported) {
      setStatus("Este navegador no soporta FaceDetector.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const detector = new window.FaceDetector({
        fastMode: true,
        maxDetectedFaces: 1
      });

      timerRef.current = window.setInterval(async () => {
        if (!videoRef.current) return;
        try {
          const faces = await detector.detect(videoRef.current);
          if (faces.length > 0) {
            setGreeting(`Hola, ${personName || "Cliente"}!`);
            setStatus("Rostro detectado correctamente.");
          } else {
            setGreeting("");
            setStatus("Buscando rostro...");
          }
        } catch (_error) {
          setStatus("No se pudo analizar el rostro en este momento.");
        }
      }, 500);

      setIsRunning(true);
      setStatus("Reconocimiento activo.");
    } catch (_error) {
      setStatus("No se pudo abrir la camara frontal.");
    }
  };

  useEffect(() => {
    return () => {
      stopFacial();
    };
  }, []);

  return (
    <section className="facial-shell">
      <div className="facial-header">
        <h3>Facial</h3>
        <p>{status}</p>
      </div>

      <div className="facial-camera">
        <video ref={videoRef} playsInline muted />
      </div>

      <div className="facial-controls">
        <input
          type="text"
          value={personName}
          onChange={(event) => setPersonName(event.target.value)}
          placeholder="Nombre a saludar"
        />
        {!isRunning ? (
          <button type="button" className="primary-btn" onClick={startFacial}>
            Iniciar facial
          </button>
        ) : (
          <button type="button" className="ghost-btn" onClick={stopFacial}>
            Detener facial
          </button>
        )}
      </div>

      {greeting ? <div className="facial-greeting">{greeting}</div> : null}
    </section>
  );
}
