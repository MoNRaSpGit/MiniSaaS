## Shared Adapters

Infraestructura reusable para comunicacion externa.

- `httpClient.js`: wrapper minimo de `fetch` para JSON.

Regla:
- Las features consumen adapters de `services/` propios.
- Los `services/` pueden apoyarse en estos adapters shared.
