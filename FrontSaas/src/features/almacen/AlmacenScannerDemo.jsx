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

function getNowDateTimeLabel() {
  const now = new Date();
  const date = now.toLocaleDateString("es-UY");
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${date} ${time}`;
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

const UX_THEMES = [
  { id: "default", label: "UX Default" },
  { id: "classic", label: "UX Clasica" },
  { id: "sunset", label: "UX Sunset" },
  { id: "mint", label: "UX Mint" }
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

function formatIncomeAmount(value) {
  const amount = new Intl.NumberFormat("es-UY", {
    maximumFractionDigits: 0
  }).format(value);
  return `+$ ${amount}`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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
  const audioContextRef = useRef(null);
  const rafIdRef = useRef(null);
  const lastValueRef = useRef("");
  const lastReadAtRef = useRef(0);

  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [scanMessage, setScanMessage] = useState("Listo para escanear.");
  const [lastCode, setLastCode] = useState("");
  const [cart, setCart] = useState([]);
  const [manualCode, setManualCode] = useState("");
  const [movements, setMovements] = useState([]);
  const [openMovementId, setOpenMovementId] = useState(null);
  const [activeView, setActiveView] = useState("scanner");
  const [themeIndex, setThemeIndex] = useState(0);
  const [visibleMovements, setVisibleMovements] = useState(3);

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

  const playBeep = () => {
    if (typeof window === "undefined") {
      return;
    }

    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        return;
      }
      audioContextRef.current = new AudioContextClass();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 1080;
    gain.gain.value = 0.001;

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    oscillator.start(now);
    oscillator.stop(now + 0.13);
  };

  const stopScanning = (message = "Scanner detenido.") => {
    stopScanLoop();

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
    setScanMessage(message);
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
          playBeep();

          if ("vibrate" in navigator) {
            navigator.vibrate(80);
          }

          stopScanning("Producto agregado. Toca 'Escanear 1 producto' para seguir.");
          return;
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
      if (audioContextRef.current?.state === "suspended") {
        await audioContextRef.current.resume();
      }

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
      setScanMessage("Escaneando 1 producto... apunta al codigo de barras.");
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

  const closeSale = () => {
    if (cart.length === 0) {
      return;
    }

    const amount = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
    const totalUnits = cart.reduce((acc, item) => acc + item.qty, 0);
    const movement = {
      id: Date.now(),
      at: getNowDateTimeLabel(),
      amount,
      totalUnits,
      products: cart.map((item) => ({
        code: item.code,
        name: item.name,
        qty: item.qty,
        unitPrice: item.price,
        subtotal: item.qty * item.price
      }))
    };

    setMovements((prev) => [movement, ...prev]);
    setOpenMovementId(null);
    setCart([]);
    setLastCode("");
    setScanMessage(`Venta registrada por ${formatCurrency(amount)}.`);
  };

  const totalIncome = movements.reduce((acc, movement) => acc + movement.amount, 0);
  const currentTheme = UX_THEMES[themeIndex];
  const visibleMovementList = movements.slice(0, visibleMovements);
  const hasMoreMovements = movements.length > visibleMovements;

  const rotateTheme = () => {
    setThemeIndex((prev) => (prev + 1) % UX_THEMES.length);
  };

  const printTicket = (movement) => {
    if (!movement || typeof window === "undefined") {
      return;
    }

    const rows = movement.products
      .map(
        (product) => `
          <tr>
            <td>${escapeHtml(`${product.qty}x ${product.name}`)}</td>
            <td style="text-align:right">${escapeHtml(formatCurrency(product.subtotal))}</td>
          </tr>
        `
      )
      .join("");

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Ticket</title>
          <style>
            body {
              margin: 0;
              font-family: monospace;
              color: #111;
              background: #fff;
            }
            .ticket {
              width: 280px;
              margin: 0 auto;
              padding: 10px;
            }
            .center { text-align: center; }
            .line { border-top: 1px dashed #111; margin: 8px 0; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            td { padding: 2px 0; vertical-align: top; }
            .total { font-weight: 700; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="center">
              <strong>SCANER</strong><br/>
              Ticket de venta
            </div>
            <div class="line"></div>
            <div>Fecha: ${escapeHtml(movement.at)}</div>
            <div class="line"></div>
            <table>
              <tbody>
                ${rows}
              </tbody>
            </table>
            <div class="line"></div>
            <table>
              <tr class="total">
                <td>Total</td>
                <td style="text-align:right">${escapeHtml(formatCurrency(movement.amount))}</td>
              </tr>
            </table>
            <div class="center" style="margin-top:10px">Gracias por su compra</div>
          </div>
          <script>
            window.onload = () => {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    const popup = window.open("", "_blank", "width=360,height=640");
    if (!popup) {
      setScanMessage("Habilita ventanas emergentes para imprimir.");
      return;
    }
    popup.document.write(html);
    popup.document.close();
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <section className={`scanner-shell theme-${currentTheme.id}`}>
      <div className="scanner-header scanner-header-main">
        <h2>Scaner</h2>
        <button type="button" className="ux-switch-btn" onClick={rotateTheme}>
          {currentTheme.label}
        </button>
      </div>

      <div className="almacen-links">
        <button
          type="button"
          className={`almacen-link ${activeView === "scanner" ? "active" : ""}`}
          onClick={() => setActiveView("scanner")}
        >
          Scanner
        </button>
        <button
          type="button"
          className={`almacen-link ${activeView === "movements" ? "active" : ""}`}
          onClick={() => setActiveView("movements")}
        >
          Movimientos
        </button>
      </div>

      {activeView === "scanner" ? (
        <>
          <div className="scanner-viewport">
            <video ref={videoRef} playsInline muted />
            <div className="scanner-overlay">
              <span>Alinear codigo</span>
            </div>
          </div>

          <p className="scanner-message">{scanMessage}</p>
          {cameraError ? <p className="scanner-error">{cameraError}</p> : null}

          <div className="scanner-actions">
            <button
              type="button"
              onClick={startScanning}
              className="primary-btn"
              disabled={isScanning}
            >
              {isScanning ? "Escaneando..." : "Escanear 1 producto"}
            </button>
            {isScanning ? (
              <button
                type="button"
                onClick={() => stopScanning("Escaneo cancelado.")}
                className="ghost-btn"
              >
                Cancelar
              </button>
            ) : null}
          </div>

          <form className="manual-form" onSubmit={handleManualSubmit}>
            <label htmlFor="manualCode">Ingreso manual</label>
            <div>
              <input
                id="manualCode"
                type="text"
                value={manualCode}
                onChange={(event) => setManualCode(event.target.value)}
                placeholder="Codigo"
              />
              <button type="submit">Agregar</button>
            </div>
          </form>

          <div className="result-panel">
            <p className="result-title">Ultimo codigo</p>
            <strong>{lastCode || "Sin lectura"}</strong>
          </div>

          <div className="history-panel">
            <div className="cart-headline">
              <p className="result-title">Ticket actual</p>
              <button type="button" className="mini-btn" onClick={clearCart}>
                Limpiar
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="history-empty">Sin productos cargados.</p>
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
              <button
                type="button"
                className="checkout-btn"
                onClick={closeSale}
                disabled={cart.length === 0}
              >
                Registrar venta
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="control-panel">
          <div className="income-card">
            <p className="result-title">Total vendido</p>
            <strong>{formatCurrency(totalIncome)}</strong>
          </div>

          <div className="movements-panel">
            <p className="result-title">Movimientos</p>
            {movements.length === 0 ? (
              <p className="history-empty">Aun no hay ventas registradas.</p>
            ) : (
              <ul className="movement-list">
                {visibleMovementList.map((movement) => {
                  const isOpen = openMovementId === movement.id;
                  return (
                    <li key={movement.id}>
                      <div className="movement-main">
                        <div>
                          <strong>{movement.at}</strong>
                          <span>{movement.totalUnits} productos vendidos</span>
                        </div>
                        <div className="movement-right">
                          <strong className="movement-positive">
                            {formatIncomeAmount(movement.amount)}
                          </strong>
                          <button
                            type="button"
                            className="mini-btn"
                            onClick={() =>
                              setOpenMovementId((prev) =>
                                prev === movement.id ? null : movement.id
                              )
                            }
                          >
                            {isOpen ? "Ocultar" : "Detalle"}
                          </button>
                          <button
                            type="button"
                            className="mini-btn"
                            onClick={() => printTicket(movement)}
                          >
                            Imprimir
                          </button>
                        </div>
                      </div>

                      {isOpen ? (
                        <ul className="movement-detail-list">
                          {movement.products.map((product) => (
                            <li key={`${movement.id}-${product.code}`}>
                              <span>
                                {product.qty}x {product.name}
                              </span>
                              <strong>{formatCurrency(product.subtotal)}</strong>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}

            {movements.length > 3 ? (
              <div className="movement-actions">
                {hasMoreMovements ? (
                  <button
                    type="button"
                    className="mini-btn"
                    onClick={() => setVisibleMovements((prev) => prev + 5)}
                  >
                    Ver +5
                  </button>
                ) : null}
                {visibleMovements < movements.length ? (
                  <button
                    type="button"
                    className="mini-btn"
                    onClick={() => setVisibleMovements(movements.length)}
                  >
                    Ver todo
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}
