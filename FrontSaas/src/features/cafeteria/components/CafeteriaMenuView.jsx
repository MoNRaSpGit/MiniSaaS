import { FEATURED_PRODUCTS, MENU_PRODUCTS } from "../data/menuCatalog";
import { formatCurrency } from "../lib/formatters";

export function CafeteriaMenuView({ uxProfile, slideIndex, addToCart, actions }) {
  return (
    <div className="cafeteria-menu">
      {uxProfile.showCarousel ? (
        <section className={`cafe-carousel carousel-style-${uxProfile.carouselStyle}`}>
          {uxProfile.carouselStyle === "stack" ? (
            <div className="cafe-featured-stack">
              {FEATURED_PRODUCTS.map((product, index) => (
                <article key={product.id} className="cafe-carousel-card">
                  <p className="cafe-pill">
                    Especial {index + 1}/{FEATURED_PRODUCTS.length}
                  </p>
                  <div className="cafe-media-placeholder">Imagen producto</div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <strong>{formatCurrency(product.price)}</strong>
                  <button type="button" onClick={() => addToCart(product)}>
                    Agregar al carrito
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <>
              <div className="cafe-carousel-viewport">
                <div
                  className="cafe-carousel-track"
                  style={{ transform: `translateX(-${slideIndex * 100}%)` }}
                >
                  {FEATURED_PRODUCTS.map((product, index) => (
                    <article key={product.id} className="cafe-carousel-card">
                      <p className="cafe-pill">
                        Destacado {index + 1}/{FEATURED_PRODUCTS.length}
                      </p>
                      <div className="cafe-media-placeholder">Imagen producto</div>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <strong>{formatCurrency(product.price)}</strong>
                      <button type="button" onClick={() => addToCart(product)}>
                        Agregar al carrito
                      </button>
                    </article>
                  ))}
                </div>
              </div>
              <div className="cafe-carousel-controls">
                <button type="button" onClick={actions.goPrevSlide}>
                  Anterior
                </button>
                <button type="button" onClick={actions.goNextSlide}>
                  Siguiente
                </button>
              </div>
              <div className="cafe-carousel-dots">
                {FEATURED_PRODUCTS.map((product, index) => (
                  <button
                    key={product.id}
                    type="button"
                    className={slideIndex === index ? "active" : ""}
                    onClick={() => actions.goToSlide(index)}
                    aria-label={`Ir al destacado ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      ) : (
        <section className="cafe-classic-specials">
          <p className="result-title">Especiales del dia</p>
          <div className="cafe-classic-list">
            {FEATURED_PRODUCTS.map((product) => (
              <article key={product.id} className="cafe-classic-item">
                <div className="cafe-media-placeholder">Imagen producto</div>
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <strong>{formatCurrency(product.price)}</strong>
                </div>
                <button type="button" onClick={() => addToCart(product)}>
                  Agregar
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className={`cafe-products-grid grid-cols-${uxProfile.productGridColumns}`}>
        {MENU_PRODUCTS.map((product) => (
          <article
            key={product.id}
            className={`cafe-product-card card-style-${uxProfile.productCardStyle}`}
          >
            <span>{product.category === "cafe" ? "Cafe" : "Postre"}</span>
            <div className="cafe-media-placeholder">Imagen producto</div>
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <strong>{formatCurrency(product.price)}</strong>
            <button type="button" onClick={() => addToCart(product)}>
              Agregar
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
