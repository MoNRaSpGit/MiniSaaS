import { useEffect, useRef, useState } from "react";

const FACE_DB_KEY = "saas_facial_profiles_v1";
const FACE_MATCH_THRESHOLD = 0.35;

function distance2D(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function buildFaceEmbedding(landmarks) {
  if (!Array.isArray(landmarks) || landmarks.length < 292) {
    return null;
  }

  const nose = landmarks[1];
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];
  const leftMouth = landmarks[61];
  const rightMouth = landmarks[291];
  const chin = landmarks[199];

  const scale = distance2D(leftEye, rightEye) || 1;
  const points = [leftEye, rightEye, leftMouth, rightMouth, chin];
  const embedding = [];

  points.forEach((point) => {
    embedding.push((point.x - nose.x) / scale);
    embedding.push((point.y - nose.y) / scale);
  });

  return embedding;
}

function euclideanDistance(a, b) {
  if (!a || !b || a.length !== b.length) return Number.POSITIVE_INFINITY;
  let total = 0;
  for (let i = 0; i < a.length; i += 1) {
    const diff = a[i] - b[i];
    total += diff * diff;
  }
  return Math.sqrt(total);
}

export function FacialView() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const frameRef = useRef(null);
  const mediaPipeLandmarkerRef = useRef(null);
  const currentEmbeddingRef = useRef(null);

  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState("Listo para reconocimiento facial.");
  const [personName, setPersonName] = useState("Ramon");
  const [greeting, setGreeting] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [canSaveFace, setCanSaveFace] = useState(false);

  const stopFacial = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    if (mediaPipeLandmarkerRef.current) {
      if (typeof mediaPipeLandmarkerRef.current.close === "function") {
        mediaPipeLandmarkerRef.current.close();
      }
      mediaPipeLandmarkerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    currentEmbeddingRef.current = null;
    setCanSaveFace(false);
    setIsRunning(false);
  };

  const findBestMatch = (embedding) => {
    if (!embedding || profiles.length === 0) {
      return null;
    }

    let best = null;

    profiles.forEach((profile) => {
      const distance = euclideanDistance(embedding, profile.embedding);
      if (!best || distance < best.distance) {
        best = { ...profile, distance };
      }
    });

    if (!best || best.distance > FACE_MATCH_THRESHOLD) {
      return null;
    }

    return best;
  };

  const handleFacialResult = (embedding) => {
    if (!embedding) {
      setGreeting("");
      setCanSaveFace(false);
      setStatus("Agregar rostro");
      return;
    }

    currentEmbeddingRef.current = embedding;
    const match = findBestMatch(embedding);

    if (match) {
      setGreeting(`Hola ${match.name}`);
      setCanSaveFace(false);
      setStatus("Rostro reconocido.");
    } else {
      setGreeting("");
      setCanSaveFace(true);
      setStatus("Guardar rostro");
    }
  };

  const runRecognitionLoop = () => {
    const detectFrame = () => {
      if (!videoRef.current || !mediaPipeLandmarkerRef.current) {
        return;
      }

      try {
        const result = mediaPipeLandmarkerRef.current.detectForVideo(
          videoRef.current,
          performance.now()
        );
        const landmarks = result?.faceLandmarks?.[0];
        const embedding = buildFaceEmbedding(landmarks);
        handleFacialResult(embedding);
      } catch (_error) {
        setStatus("No se pudo analizar el rostro en este momento.");
      }

      frameRef.current = requestAnimationFrame(detectFrame);
    };

    frameRef.current = requestAnimationFrame(detectFrame);
  };

  const setupMediaPipeRecognition = async () => {
    const { FilesetResolver, FaceLandmarker } = await import("@mediapipe/tasks-vision");

    const fileset = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    const landmarker = await FaceLandmarker.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
      },
      runningMode: "VIDEO",
      numFaces: 1,
      minFaceDetectionConfidence: 0.45,
      minTrackingConfidence: 0.45
    });

    mediaPipeLandmarkerRef.current = landmarker;
    setStatus("Reconocimiento activo (MediaPipe).");
    runRecognitionLoop();
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

      setStatus("Cargando reconocimiento facial...");
      await setupMediaPipeRecognition();
      setIsRunning(true);
    } catch (_error) {
      setStatus("No se pudo abrir la camara frontal.");
    }
  };

  const saveCurrentFace = () => {
    const normalizedName = personName.trim();
    if (!normalizedName) {
      setStatus("Ingresa un nombre para guardar el rostro.");
      return;
    }

    const embedding = currentEmbeddingRef.current;
    if (!embedding) {
      setStatus("No hay rostro valido para guardar.");
      return;
    }

    const nextProfiles = [...profiles];
    const existingIndex = nextProfiles.findIndex(
      (profile) => profile.name.toLowerCase() === normalizedName.toLowerCase()
    );
    const nextProfile = { name: normalizedName, embedding };

    if (existingIndex >= 0) {
      nextProfiles[existingIndex] = nextProfile;
    } else {
      nextProfiles.push(nextProfile);
    }

    setProfiles(nextProfiles);
    localStorage.setItem(FACE_DB_KEY, JSON.stringify(nextProfiles));
    setStatus("Rostro guardado.");
    setGreeting(`Hola ${normalizedName}`);
    setCanSaveFace(false);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FACE_DB_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setProfiles(parsed.filter((profile) => profile?.name && Array.isArray(profile?.embedding)));
      }
    } catch (_error) {
      setProfiles([]);
    }
  }, []);

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
        {isRunning && canSaveFace ? (
          <button type="button" className="primary-btn" onClick={saveCurrentFace}>
            Guardar rostro
          </button>
        ) : null}
      </div>

      {greeting ? <div className="facial-greeting">{greeting}</div> : null}
      <p className="facial-db-copy">Rostros guardados: {profiles.length}</p>
    </section>
  );
}
