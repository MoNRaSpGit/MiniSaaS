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

const KNOWN_PRODUCTS = {
  "5455345": { name: "Galletitas Mix Crocante 170g", price: 1290 },
  "7791234567890": { name: "Yerba Serrana Suave 1kg", price: 2980 },
  "7501031311309": { name: "Jabon Liquido Fresh 500ml", price: 1840 }
};

const BRANDS = ["Norte", "Del Valle", "Maxi", "Urbano", "Don", "Prime", "Eco"];
const ITEMS = [
  "Arroz Integral 1kg",
  "Pasta Fusilli 500g",
  "Leche Entera 1L",
  "Atun en Agua 170g",
  "Cafe Molido 250g",
  "Jugo Naranja 1L",
  "Pan Lactal Blanco",
  "Detergente Limon 750ml",
  "Papel Higienico x4",
  "Gaseosa Cola 2.25L"
];

function hashCode(value) {
  return value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0
  }).format(value);
}

function getDemoProductFromCode(code) {
  if (KNOWN_PRODUCTS[code]) {
    return { ...KNOWN_PRODUCTS[code], code };
  }

  const hash = hashCode(code);
  const brand = BRANDS[hash % BRANDS.length];
  const item = ITEMS[hash % ITEMS.length];
  const price = 990 + ((hash % 26) + 1) * 120;

  return {
    code,
    name: `${brand} ${item}`,
    price
  };
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
  const [cart, setCart] = useState([]);
  const [manualCode, setManualCode] = useState("");

  const isSupported = useMemo(() => {
    return typeof window !== "undefined" && "BarcodeDetector" in window;
  }, []);

  const registerCode = (value, source = "camera") => {
    const product = getDemoProductFromCode(value);

    setLastCode(value);

    setCart((prev) => {
      const existing = prev.find((item) => item.code === value);
      if (!existing) {
        return [{ ...product, qty: 1, source, at: getNowLabel() }, ...prev];
      }

      return prev.map((item) =>
        item.code === value
          ? { ...item, qty: item.qty + 1, source, at: getNowLabel() }
          : item
      );
    });

    setScanMessage(`Agregado: ${product.name} - ${formatCurrency(product.price)}`);
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
          registerCode(rawValue, "camera");

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
    registerCode(value, "manual");
    setManualCode("");
  };

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalAmount = cart.reduce((acc, item) => acc + item.qty * item.price, 0);

  const clearCart = () => {
    setCart([]);
    setLastCode("");
    setScanMessage("Caja reiniciada. Listo para escanear.");
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
        <div className="cart-headline">
          <p className="result-title">Ticket de compra</p>
          <button type="button" className="mini-btn" onClick={clearCart}>
            Limpiar
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="history-empty">Escanea productos para armar la compra.</p>
        ) : (
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.code}>
                <div>
                  <strong>{item.name}</strong>
                  <span>
                    Cod: {item.code} - {item.source} - {item.at}
                  </span>
                </div>
                <div className="cart-item-price">
                  <small>x{item.qty}</small>
                  <strong>{formatCurrency(item.qty * item.price)}</strong>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="cart-summary">
          <p>
            Items: <strong>{totalItems}</strong>
          </p>
          <p className="cart-total">
            Total: <strong>{formatCurrency(totalAmount)}</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
