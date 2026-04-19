export function AlmacenScannerView({ videoRef, state, derived, actions, utils }) {
  const { isScanning, cameraError, scanMessage, lastCode, cart, manualCode } = state;
  const { totalItems, totalAmount } = derived;
  const { formatCurrency } = utils;

  return (
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
          onClick={actions.startScanning}
          className="primary-btn"
          disabled={isScanning}
        >
          {isScanning ? "Escaneando..." : "Escanear 1 producto"}
        </button>
        {isScanning ? (
          <button
            type="button"
            onClick={() => actions.stopScanning("Escaneo cancelado.")}
            className="ghost-btn"
          >
            Cancelar
          </button>
        ) : null}
      </div>

      <form className="manual-form" onSubmit={actions.handleManualSubmit}>
        <label htmlFor="manualCode">Ingreso manual</label>
        <div>
          <input
            id="manualCode"
            type="text"
            value={manualCode}
            onChange={(event) => actions.setManualCode(event.target.value)}
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
          <button type="button" className="mini-btn" onClick={actions.clearCart}>
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
            onClick={actions.closeSale}
            disabled={cart.length === 0}
          >
            Registrar venta
          </button>
        </div>
      </div>
    </>
  );
}
