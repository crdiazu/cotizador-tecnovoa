# 🗂️ Instructivo de Gestión de Datos — Catálogo VESTAS

> **Para:** Ursula Zuñiga
> **Planilla origen:** Google Sheets → `Hoja 2` (`Tabla_1`)  
> **Última revisión:** Mayo 2026

---

## ¿Cómo funciona la conexión?

El catálogo web carga los datos **automáticamente** desde Google Sheets cada vez que un usuario abre la página. No hay sincronización manual ni botón de actualización: basta con guardar cambios en la planilla y la próxima vez que el cliente abra el catálogo verá los datos actualizados.

```
Google Sheets (Hoja 2)
        ↓  exporta como CSV automáticamente
  Catálogo Web (index.html)
        ↓  parsea las columnas en orden
  Tarjetas de Productos
```

> ⚠️ **La hoja activa debe ser siempre `Hoja 2`.** El catálogo está configurado para leer únicamente esa hoja (`gid=1034642903`). No mover ni renombrar esa pestaña.

---

## 📋 Estructura obligatoria de la planilla

La planilla tiene **7 columnas en orden fijo**. El sistema las lee por posición (A, B, C…), no por nombre, por lo que **no deben reordenarse**.

| Columna | Nombre | Tipo | Descripción |
|---------|--------|------|-------------|
| **A** | `PN` | Texto | Part Number único del producto. Ej: `63D4GAR1CL` |
| **B** | `Producto` | Texto | Nombre completo del producto. Ej: `Lenovo T34w-40 Monitor Display` |
| **C** | `Categoria` | Texto | Categoría del producto. Se usa para el filtro lateral del catálogo |
| **D** | `Stock` | Número entero | Unidades disponibles. Ej: `15` |
| **E** | `Precio` | Número | Precio neto en CLP (sin puntos ni símbolos). Ej: `60000` |
| **F** | `Imagen` | URL | Enlace directo a la imagen del producto (URL pública) |
| **G** | `FechaActualizacion` | Fecha | Fecha de la última actualización. Ej: `2026-05-13` |

---

## ✅ Reglas por columna

### Columna A — PN (Part Number)
- Debe ser **único** por fila. No repetir PNs.
- Usar el código oficial del fabricante (Lenovo, HP, etc.)
- Sin espacios ni caracteres especiales

```
✅ Correcto:   63D4GAR1CL
❌ Incorrecto: 63D4GAR 1CL  /  PN-63D4GAR1CL
```

---

### Columna B — Producto
- Nombre completo tal como aparece en el catálogo del fabricante
- Puede incluir espacios y caracteres normales
- **No usar comas** (`,`) — rompen el formato CSV

```
✅ Correcto:   Lenovo T34w-40 Monitor Display
❌ Incorrecto: Lenovo T34w-40, Monitor Display
```

---

### Columna C — Categoría
- Usar siempre la **misma escritura** para la misma categoría (el filtro lateral es sensible a mayúsculas)
- Categorías recomendadas (usar tal cual):

```
Monitores
Notebooks
Servidores
Cables & Red
Audio
Accesorios
```

> 💡 Si agregas una categoría nueva, aparecerá automáticamente en el menú lateral del catálogo.

---

### Columna D — Stock
- Solo **números enteros** (sin decimales ni texto)
- Si el producto no tiene stock disponible, ingresar `0`
- No dejar la celda vacía

```
✅ Correcto:   15  /  0
❌ Incorrecto: 15 unid  /  -  /  (vacío)
```

---

### Columna E — Precio
- Ingresar el precio **neto en CLP** (sin IVA)
- Solo el número, **sin puntos, comas de miles ni símbolo $**
- El catálogo formatea automáticamente como `CLP$ 60.000 + iva`

```
✅ Correcto:   60000
❌ Incorrecto: $60.000  /  60,000  /  CLP60000
```

> ⚠️ Si la columna muestra `#ERROR!` es porque hay una fórmula de conversión. Revisar que la celda contenga el **valor numérico directo**, no una fórmula que falle.

---

### Columna F — Imagen
- Debe ser una **URL pública** que apunte directamente a la imagen (`.jpg`, `.png`, `.webp`)
- Probar la URL en el navegador antes de ingresarla: debe mostrarse la imagen sin pedir login
- Si no hay imagen disponible, dejar la celda con texto `Imagen` (el catálogo mostrará el espacio vacío)

```
✅ Correcto:   https://www.lenovo.com/.../.../image.jpg
❌ Incorrecto: https://drive.google.com/file/d/...  (requiere permisos)
```

> 💡 Para imágenes de Google Drive: usar **"Obtener enlace" → "Cualquier persona con el enlace"** y convertir el URL al formato:  
> `https://drive.google.com/uc?export=view&id=FILE_ID`

---

### Columna G — FechaActualizacion
- Formato recomendado: `YYYY-MM-DD` (ej: `2026-05-13`)
- El catálogo compara esta fecha con la fecha actual para mostrar el estado **"✓ Datos de hoy"** o **"⚠ Desactualizado"**
- **Actualizar esta columna en todas las filas** cada vez que se haga una carga nueva

---

## ➕ Cómo agregar un producto nuevo

1. Ir a **Google Sheets → `Hoja 2`**
2. Ir a la **última fila con datos** y agregar una fila nueva debajo
3. Completar **todas las columnas A → G** siguiendo las reglas anteriores
4. Verificar que no haya comas en los campos de texto
5. Actualizar la **Columna G** con la fecha de hoy
6. Guardar (Ctrl + S o automático)

✅ El producto aparecerá en el catálogo en la **próxima carga de la página**.

---

## ✏️ Cómo editar un producto existente

1. Buscar la fila por el PN en la Columna A
2. Editar el campo que corresponda (precio, stock, etc.)
3. Actualizar la **Columna G** con la fecha de hoy
4. Guardar

---

## 🗑️ Cómo eliminar un producto

Simplemente **eliminar la fila completa** de la planilla. El producto dejará de aparecer en el catálogo en la próxima carga.

> No dejar filas vacías en medio de la tabla.

---

## ⚙️ Checklist de actualización mensual

Usar esta lista cada vez que se haga una carga masiva de precios o stock:

- [ ] Verificar que no hay comas en nombres de productos (Columna B)
- [ ] Verificar que los precios son números planos sin formato (Columna E)
- [ ] Verificar que las categorías están escritas de forma consistente (Columna C)
- [ ] Verificar que las URLs de imagen son públicas y funcionan (Columna F)
- [ ] Actualizar la fecha en **todas las filas** de la Columna G con la fecha de hoy
- [ ] Abrir el catálogo y confirmar el indicador **"✓ Datos de hoy"**
- [ ] Revisar que los precios se muestren correctamente en formato `CLP$ ... + iva`

---

## 🔗 Acceso directo a la planilla

**URL de edición:**  
[https://docs.google.com/spreadsheets/d/1Jq5zoUnmfm1ySwRzqaqcMV_LGLyq6F1ghNjEDrUI7OY/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1Jq5zoUnmfm1ySwRzqaqcMV_LGLyq6F1ghNjEDrUI7OY/edit?usp=sharing)

**URL CSV que usa el catálogo (solo lectura):**  
`https://docs.google.com/spreadsheets/d/1Jq5zoUnmfm1ySwRzqaqcMV_LGLyq6F1ghNjEDrUI7OY/export?format=csv`

---

## ❓ Problemas comunes

| Síntoma | Causa probable | Solución |
|---------|----------------|----------|
| Precio aparece como `$NaN` | Celda de precio tiene texto o fórmula rota | Ingresar número plano sin formato |
| Producto aparece sin imagen | URL de imagen con permisos o inválida | Usar URL pública directa a la imagen |
| Categoría no aparece en el filtro | Error de tipeo en la categoría | Verificar mayúsculas y espacios exactos |
| Catálogo muestra "Error al cargar" | Planilla sin permisos públicos de lectura | Verificar que la hoja es pública para "cualquier persona con el enlace" |
| Indicador muestra "⚠ Desactualizado" | Columna G no tiene la fecha de hoy | Actualizar FechaActualizacion en todas las filas |
| Dos productos con el mismo nombre | PNs distintos, correcto | No es un error, el PN los diferencia |

---

*Catálogo B2B Privado VESTAS / TECNOVOA — Documento de uso interno.*
