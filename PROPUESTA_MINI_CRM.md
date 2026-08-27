---
fecha: 2026-08-27
tipo: "propuesta"
titulo: "Propuesta de mini-CRM para TECNOVOA (cotizaciones + clientes + métricas)"
estado: "DECISIONES CONFIRMADAS + BASE IMPLEMENTADA"
---

# Propuesta de mini-CRM — TECNOVOA

Basado en `cotizador/` (v1, Firebase + Obsidian) y `catalogo/` (2.0, Google Sheets).
Objetivo: cerrar la brecha de "no tengo dónde cargar clientes ni ver el estado de las
cotizaciones" sin reimplementar lo que ya funciona.

## Decisiones del usuario (confirmadas 2026-08-27)

1. **Clientes** → nueva pestaña `CLIENTES` en "Catalogo2026" (limpiar esta planilla). ✅ CREADA.
2. **Persistencia** → Google Sheets como fuente + espejo Firestore opcional. Llevar a **GitHub** y documentar. ✅ EN CURSO (docs).
3. **Alcance** → cotizaciones + clientes + estados + dashboard. **NO POST-VENTA**.
4. **"No deja espacio para leer"** → detalle visual en el cotizador (UI). **Diferir**.
5. **Vestas** → proyecto activo en producción en cliente; **NO alterar** la fuente. **Aislar** (hacer una copia). El usuario quiere una copia.

## Estado de implementación

- ✅ Fix de lectura del catálogo: `SHEET_URL` ahora incluye `&gid=1034642903` (lee `CATALOGO`).
  Ver `catalogo/DIAGNOSIS_CATALOGO.md` (versión corregida).
- ✅ Pestaña `CLIENTES` creada (gid=1748406670) con encabezados:
  `ID, Nombre / Razón Social, Contacto, Email, Teléfono, Empresa / RUT, Dirección, Ciudad, País, Origen, Estado, Notas, Fecha Creación`.
- ✅ Pestaña `COTIZACIONES` creada (gid=1995494712) con encabezados:
  `Folio, Fecha, Cliente (ID/Nombre), Items (Part Numbers / Desc), Total CLP, Total USD, Estado, Vendedor, Notas, Link PDF, Fecha Cierre`.
- ⬜ Dashboard read-only (HTML) que lea ambas pestañas.
- ⬜ Conexión del catálogo: al generar PDF, append a `COTIZACIONES` + buscar/crear en `CLIENTES`.
- ⬜ Copia aislada de Vestas (no tocar producción).
- ⬜ Subir a GitHub + README.

## Arquitectura (confirmada)

```
catalogo/ 2.0 (web, lee CATALOGO gid=1034642903)
   │  cotización (genera PDF + folio)
   ▼
[logCotizacion] ──► Firestore cotizaciones  ──► sync_cotizaciones.py ──► Obsidian CRM (v1, ref)
   │                                                       ▲
   └────────────────► Sheets: COTIZACIONES + CLIENTES ◄──────┘
                              ▲
                   mini-CRM dashboard (nueva vista read-only, por construir)
```

## Módulos del mini-CRM

1. **Carga de clientes** — formulario ligero que escribe en `CLIENTES` (o importa CSV).
2. **Registro de cotización** — al generar PDF en el catálogo, además de Firestore,
   append a `COTIZACIONES` con el cliente y estado inicial ("Enviada").
3. **Estados** — Enviada → Respondida → Ganada / Perdida (columna `Estado` en Sheets).
4. **Dashboard** — página HTML que lee `COTIZACIONES`+`CLIENTES` y muestra:
   pipeline por estado, totales USD/CLP, cotizaciones por cliente, filtro por mes.
5. **Caso Vestas** — etiqueta `Origen=Vestas`; se filtra el pipeline por origen.
   La fuente Vestas NO se toca; se trabaja sobre una copia aislada.

## Lo que YA existe y se reusa (no reinventar)

- `catalogo/js/app.js` `generatePDF` (L1313) y `logCotizacion` (L1390, Firebase).
- `cotizador/sync_cotizaciones.py` (Firestore → Obsidian).
- `cotizador/docs/02_Proceso_Operativo_Catalogo.md` y `03_Brechas_y_Conexiones_Faltantes.md`.
- Composio `googlesheets` conectado (crdiazu@gmail.com) para leer/escribir las nuevas pestañas.

## Siguiente paso concreto

Construir el dashboard read-only (HTML) que consume `CLIENTES`+`COTIZACIONES` vía
`export?format=csv&gid=...`, y cablear el append desde `logCotizacion`. Luego subir a GitHub.
