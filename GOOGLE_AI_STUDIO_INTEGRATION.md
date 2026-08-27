# 🔌 Google AI Studio & Antigravity Integration — El Cableado

Este documento detalla la integración técnica con la API de Google AI Studio y el asistente de desarrollo avanzado Antigravity para la automatización, generación de datos y análisis comercial del catálogo de TECNOVOA.

---

## 🤖 Selección y Configuración del Modelo

El sistema utiliza la API de Google AI Studio configurando como estándar el modelo **gemini-1.5-flash-latest**.

### Justificación:
*   **Velocidad y Latencia:** Ofrece tiempos de respuesta inferiores a 1.5 segundos en la generación de textos y resúmenes.
*   **Bajo Costo:** Optimiza el consumo de tokens en tareas repetitivas de análisis de planillas.
*   **Ventana de Contexto (1M+ tokens):** Permite procesar catálogos de productos sumamente extensos (CSV) sin necesidad de segmentar la información.

---

## ⚙️ Parámetros de Inferencia de la API

Para garantizar que los cálculos comerciales sean exactos y no existan desviaciones o alucinaciones matemáticas, se aplican los siguientes hiperparámetros en las llamadas a Gemini:

| Parámetro | Valor | Propósito |
|---|---|---|
| **`temperature`** | `0.1` | Minimiza la creatividad. Garantiza respuestas reproducibles y consistentes en Part Numbers, costos y stocks. |
| **`top_P`** | `0.9` | Limita la selección de palabras a las más probables para mantener coherencia corporativa. |
| **`top_K`** | `40` | Diversidad controlada de vocabulario técnico. |
| **`max_output_tokens`** | `2048` | Suficiente para generar notas de cotización detalladas en formato markdown. |

---

## 🛠️ Orquestación de Entorno con Antigravity

El flujo de trabajo técnico y la generación de proformas se integran a través del ecosistema de **Antigravity**:

1.  **Entorno Local:**
    *   Antigravity gestiona los tokens y credenciales de la sesión directamente a través de las variables de entorno de la consola de desarrollo local (`GEMINI_API_KEY`).
    *   Los prompts del sistema se inyectan dinámicamente desde el directorio `.ai/` del proyecto.
2.  **Validación de Prompts (Ejemplo Preventa):**
    *   *System Prompt:* "Actúa como Ingeniero de Preventa de Tecnovoa. Lee los Part Numbers del catálogo CSV y responde solo con compatibilidades directas y precios en CLP según la Columna J y el tipo de cambio XCL (Celda J1)."
    *   *Entrada:* "Necesito una cotización de 3 monitores compatibles con la laptop ThinkPad PN: 64A4MARXCL."
    *   *Respuesta Esperada:* "1. Monitor Lenovo L24i-40 (P/N: TBD) - CLP$ 120.000 + IVA c/u. Total CLP$ 360.000 + IVA. Entrega estimada: 3 días."
