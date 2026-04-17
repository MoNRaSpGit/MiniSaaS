import { useEffect, useMemo, useRef, useState } from "react";

const SCAN_FORMATS = [
  "ean_13",
  "ean_8",
  "upc_a",
  "upc_e",
  "code_128",
  "code_39",
  "itf",
  "qr_code"
];

function getNowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function AlmacenScannerDemo() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const rafIdRef = useRef(null);
  const lastValueRef = useRef("");
  const lastReadAtRef = useRef(0);

  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [scanMessage, setScanMessage] = useState("Listo para escanear.");
  const [lastCode, setLastCode] = useState("");
  const [history, setHistory] = useState([]);
  const [manualCode, setManualCode] = useState("");

  const isSupported = useMemo(() => {
    return typeof window !== "undefined" && "BarcodeDetector" in window;
  }, []);

  const addHistoryItem = (value, source = "camera") => {
    setLastCode(value);
    setHistory((prev) => [{ value, source, at: getNowLabel() }, ...prev].slice(0, 8));
  };

  const stopScanLoop = () => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  const stopScanning = () => {
    stopScanLoop();

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
    setScanMessage("Scanner detenido.");
  };

  const scanFrame = async () => {
    if (!videoRef.current || !detectorRef.current) {
      return;
    }

    try {
      const barcodes = await detectorRef.current.detect(videoRef.current);

      if (barcodes.length > 0) {
        const rawValue = barcodes[0].rawValue?.trim();
        const now = Date.now();
        const isNewValue = rawValue && rawValue !== lastValueRef.current;
        const enoughTimePassed = now - lastReadAtRef.current > 1200;

        if (isNewValue || enoughTimePassed) {
          lastValueRef.current = rawValue;
          lastReadAtRef.current = now;
          addHistoryItem(rawValue, "camera");
          setScanMessage(`Codigo detectado: ${rawValue}`);

          if ("vibrate" in navigator) {
            navigator.vibrate(80);
          }
        }
      }
    } catch (_error) {
      setScanMessage("Buscando codigo...");
    }

    rafIdRef.current = requestAnimationFrame(scanFrame);
  };

  const startScanning = async () => {
    setCameraError("");
    setScanMessage("Abriendo camara...");

    if (!isSupported) {
      setCameraError("Este navegador no soporta BarcodeDetector.");
      setScanMessage("Tu navegador no permite escaneo nativo.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      let detector;
      try {
        detector = new window.BarcodeDetector({ formats: SCAN_FORMATS });
      } catch (_error) {
        detector = new window.BarcodeDetector();
      }

      detectorRef.current = detector;
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsScanning(true);
      setScanMessage("Escaneando... apunta al codigo de barras.");
      scanFrame();
    } catch (error) {
      setCameraError("No se pudo abrir la camara. Revisa permisos del navegador.");
      setScanMessage("Fallo al abrir camara.");
      console.error(error);
    }
  };

  const handleManualSubmit = (event) => {
    event.preventDefault();
    const value = manualCode.trim();
    if (!value) {
      return;
    }
    addHistoryItem(value, "manual");
    setScanMessage(`Codigo cargado manualmente: ${value}`);
    setManualCode("");
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <section className="scanner-shell">
      <div className="scanner-header">
        <h2>Demo Scanner - Almacen</h2>
        <p>
          Prueba rapida para validar lectura desde celular. Si detecta bien, seguimos
          con el modulo completo.
        </p>
      </div>

      <div className="scanner-viewport">
        <video ref={videoRef} playsInline muted />
        <div className="scanner-overlay">
          <span>Apunta al codigo</span>
        </div>
      </div>

      <p className="scanner-message">{scanMessage}</p>
      {cameraError ? <p className="scanner-error">{cameraError}</p> : null}

      <div className="scanner-actions">
        {!isScanning ? (
          <button type="button" onClick={startScanning} className="primary-btn">
            Iniciar scanner
          </button>
        ) : (
          <button type="button" onClick={stopScanning} className="ghost-btn">
            Detener scanner
          </button>
        )}
      </div>

      <form className="manual-form" onSubmit={handleManualSubmit}>
        <label htmlFor="manualCode">Carga manual para test rapido</label>
        <div>
          <input
            id="manualCode"
            type="text"
            value={manualCode}
            onChange={(event) => setManualCode(event.target.value)}
            placeholder="Ej: 7791234567890"
          />
          <button type="submit">Guardar</button>
        </div>
      </form>

      <div className="result-panel">
        <p className="result-title">Ultimo codigo</p>
        <strong>{lastCode || "Aun sin lecturas"}</strong>
      </div>

      <div className="history-panel">
        <p className="result-title">Lecturas recientes</p>
        {history.length === 0 ? (
          <p className="history-empty">Todavia no hay lecturas.</p>
        ) : (
          <ul>
            {history.map((item, index) => (
              <li key={`${item.value}-${item.at}-${index}`}>
                <strong>{item.value}</strong>
                <span>
                  {item.source} - {item.at}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
