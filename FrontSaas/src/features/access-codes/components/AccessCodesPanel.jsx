import { useAccessCodesController } from "../hooks/useAccessCodesController";

export function AccessCodesPanel() {
  const { catalogUrl, catalogQrUrl, items } = useAccessCodesController();

  return (
    <section className="codes-panel">
      <div className="codes-header">
        <h2>Acceso por codigo</h2>
        <p>Escanea para abrir MiniSaaS o entrar directo a cada proyecto.</p>
      </div>

      <div className="codes-grid">
        <article className="code-card">
          <h3>Catalogo MiniSaaS</h3>
          <img src={catalogQrUrl} alt="QR catalogo MiniSaaS" />
          <a href={catalogUrl} target="_blank" rel="noreferrer">
            Abrir catalogo
          </a>
        </article>

        {items.map((item) => (
          <article key={item.slug} className="code-card">
            <h3>{item.name}</h3>
            <img src={item.qrUrl} alt={`QR ${item.name}`} />
            <a href={item.url} target="_blank" rel="noreferrer">
              Abrir {item.name}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
