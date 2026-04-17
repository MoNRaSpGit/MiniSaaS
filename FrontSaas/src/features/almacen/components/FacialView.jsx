import { useEffect, useMemo, useRef, useState } from "react";

export function FacialView() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const frameRef = useRef(null);
  const mediaPipeDetectorRef = useRef(null);
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
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    if (mediaPipeDetectorRef.current) {
      mediaPipeDetectorRef.current = null;
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

  const applyDetectionResult = (facesCount) => {
    if (facesCount > 0) {
      setGreeting(`Hola, ${personName || "Cliente"}!`);
      setStatus("Rostro detectado correctamente.");
    } else {
      setGreeting("");
      setStatus("Buscando rostro...");
    }
  };

  const runMediaPipeLoop = () => {
    const detectFrame = () => {
      if (!videoRef.current || !mediaPipeDetectorRef.current) {
        return;
      }

      try {
        const result = mediaPipeDetectorRef.current.detectForVideo(
          videoRef.current,
          performance.now()
        );
        const facesCount = result?.detections?.length ?? 0;
        applyDetectionResult(facesCount);
      } catch (_error) {
        setStatus("No se pudo analizar el rostro en este momento.");
      }

      frameRef.current = requestAnimationFrame(detectFrame);
    };

    frameRef.current = requestAnimationFrame(detectFrame);
  };

  const setupMediaPipeFallback = async () => {
    const { FilesetResolver, FaceDetector } = await import("@mediapipe/tasks-vision");

    const fileset = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    const detector = await FaceDetector.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite"
      },
      runningMode: "VIDEO",
      minDetectionConfidence: 0.45
    });

    mediaPipeDetectorRef.current = detector;
    setStatus("Reconocimiento activo (MediaPipe).");
    runMediaPipeLoop();
  };

  const startFacial = async () => {
    setGreeting("");

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

      if (faceDetectorSupported) {
        const detector = new window.FaceDetector({
          fastMode: true,
          maxDetectedFaces: 1
        });

        timerRef.current = window.setInterval(async () => {
          if (!videoRef.current) return;
          try {
            const faces = await detector.detect(videoRef.current);
            applyDetectionResult(faces.length);
          } catch (_error) {
            setStatus("No se pudo analizar el rostro en este momento.");
          }
        }, 450);

        setStatus("Reconocimiento activo (nativo).");
      } else {
        setStatus("Cargando motor facial alternativo...");
        await setupMediaPipeFallback();
      }

      setIsRunning(true);
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
