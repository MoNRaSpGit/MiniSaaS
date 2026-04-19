import { useEffect, useMemo, useRef, useState } from "react";
import { DEMO_MOVEMENTS } from "../data/demoMovements";
import { getDemoProductFromCode } from "../data/catalog";
import { buildPlainTicket } from "../lib/ticketBuilder";

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

const UX_THEMES = [
  { id: "default", label: "UX Default" },
  { id: "classic", label: "UX Clasica" },
  { id: "sunset", label: "UX Sunset" },
  { id: "mint", label: "UX Mint" }
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

export function formatCurrency(value) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatIncomeAmount(value) {
  const amount = new Intl.NumberFormat("es-UY", {
    maximumFractionDigits: 0
  }).format(value);
  return `+$ ${amount}`;
}

export function useAlmacenController() {
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
  const [movements, setMovements] = useState(DEMO_MOVEMENTS);
  const [openMovementId, setOpenMovementId] = useState(null);
  const [activeView, setActiveView] = useState("scanner");
  const [themeIndex, setThemeIndex] = useState(0);
  const [visibleMovements, setVisibleMovements] = useState(3);

  const isSupported = useMemo(
    () => typeof window !== "undefined" && "BarcodeDetector" in window,
    []
  );

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

  const rotateTheme = () => {
    setThemeIndex((prev) => (prev + 1) % UX_THEMES.length);
  };

  const printTicketRawBt = (movement) => {
    if (!movement || typeof window === "undefined") {
      return;
    }

    const rawText = buildPlainTicket(movement);
    setScanMessage("Enviando ticket a RawBT...");
    const encodedText = encodeURIComponent(rawText);
    const rawbtUrl = `rawbt://print?text=${encodedText}`;
    try {
      window.location.href = rawbtUrl;
    } catch (_error) {
      setScanMessage("No se pudo abrir RawBT.");
    }
  };

  useEffect(() => () => stopScanning(), []);

  return {
    refs: { videoRef },
    state: {
      isScanning,
      cameraError,
      scanMessage,
      lastCode,
      cart,
      manualCode,
      movements,
      openMovementId,
      activeView,
      visibleMovements,
      currentTheme: UX_THEMES[themeIndex]
    },
    derived: {
      totalItems: cart.reduce((acc, item) => acc + item.qty, 0),
      totalAmount: cart.reduce((acc, item) => acc + item.qty * item.price, 0),
      totalIncome: movements.reduce((acc, movement) => acc + movement.amount, 0),
      visibleMovementList: movements.slice(0, visibleMovements),
      hasMoreMovements: movements.length > visibleMovements
    },
    actions: {
      startScanning,
      stopScanning,
      handleManualSubmit,
      clearCart,
      closeSale,
      rotateTheme,
      printTicketRawBt,
      setActiveView,
      setManualCode,
      setOpenMovementId,
      setVisibleMovements
    },
    utils: { formatCurrency, formatIncomeAmount }
  };
}
