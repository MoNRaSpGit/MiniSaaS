export function AlmacenMovementsView({ state, derived, actions, utils }) {
  const { movements, openMovementId, visibleMovements } = state;
  const { totalIncome, visibleMovementList, hasMoreMovements } = derived;
  const { formatCurrency, formatIncomeAmount } = utils;

  return (
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
                          actions.setOpenMovementId((prev) =>
                            prev === movement.id ? null : movement.id
                          )
                        }
                      >
                        {isOpen ? "Ocultar" : "Detalle"}
                      </button>
                      <button
                        type="button"
                        className="mini-btn"
                        onClick={() => actions.printTicketRawBt(movement)}
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
                onClick={() => actions.setVisibleMovements((prev) => prev + 5)}
              >
                Ver +5
              </button>
            ) : null}
            {visibleMovements < movements.length ? (
              <button
                type="button"
                className="mini-btn"
                onClick={() => actions.setVisibleMovements(movements.length)}
              >
                Ver todo
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
