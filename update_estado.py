"""
update_estado.py — Actualiza el estado de una cotización.

Uso:
    python update_estado.py COT-2026-XXXXX "cerrada"

Estados válidos: emitida, propuesta, negociacion, cerrada, perdida, desierta, entregada
"""

import json
import os
import sys
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
VAULT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
LOG_FILE = os.path.join(SCRIPT_DIR, "cotizaciones_log.json")
COM_DIR = os.path.join(VAULT_ROOT, "_Comunicaciones")

ESTADOS_VALIDOS = {"emitida", "propuesta", "negociacion", "cerrada", "perdida", "desierta", "entregada"}


def update_estado(doc_no, nuevo_estado):
    if not os.path.exists(LOG_FILE):
        print(f"ERROR: No existe {LOG_FILE}")
        return False

    with open(LOG_FILE, "r", encoding="utf-8") as f:
        logs = json.load(f)

    encontrado = False
    for entry in logs:
        if entry.get("document_no") == doc_no:
            entry["estado"] = nuevo_estado
            encontrado = True
            break

    if not encontrado:
        print(f"ERROR: No se encontró cotización {doc_no}")
        return False

    with open(LOG_FILE, "w", encoding="utf-8") as f:
        json.dump(logs, f, indent=4, ensure_ascii=False)

    # Actualizar nota individual en _Comunicaciones/
    com_file = os.path.join(COM_DIR, f"cotizacion_{doc_no}.md")
    if os.path.exists(com_file):
        with open(com_file, "r", encoding="utf-8") as f:
            content = f.read()
        content = re.sub(r'^estado: ".*?"', f'estado: "{nuevo_estado}"', content, flags=re.MULTILINE)
        with open(com_file, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  -> Nota individual actualizada: _Comunicaciones/cotizacion_{doc_no}.md")

    # Regenerar historial
    sys.path.insert(0, SCRIPT_DIR)
    try:
        from server import update_quotation_history
        update_quotation_history()
        print(f"  -> Historial regenerado: tecnovoa_quotation_history.md")
    except ImportError as e:
        print(f"  !! No se pudo regenerar historial: {e}")

    return True


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        print(f"Estados válidos: {', '.join(sorted(ESTADOS_VALIDOS))}")
        sys.exit(1)

    doc_no = sys.argv[1].strip()
    nuevo_estado = sys.argv[2].strip().lower()

    if nuevo_estado not in ESTADOS_VALIDOS:
        print(f"ERROR: Estado '{nuevo_estado}' no válido.")
        print(f"Usar uno de: {', '.join(sorted(ESTADOS_VALIDOS))}")
        sys.exit(1)

    print(f"Actualizando {doc_no} -> {nuevo_estado}...")
    if update_estado(doc_no, nuevo_estado):
        print(f"OK - {doc_no} actualizado a '{nuevo_estado}'")
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
