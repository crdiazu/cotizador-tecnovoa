"""
sync_cotizaciones.py — Sincroniza cotizaciones desde Firestore al vault de Obsidian.

Uso:
    1. Descargar clave de servicio desde Firebase Console:
       Proyecto > Ajustes > Cuentas de servicio > Generar nueva clave privada
       Guardar como 'serviceAccountKey.json' en este mismo directorio.

    2. Instalar dependencia:
       pip install firebase-admin

    3. Ejecutar:
       python sync_cotizaciones.py
"""

import os
import sys
import json

try:
    import firebase_admin
    from firebase_admin import credentials, firestore
except ImportError:
    print("Error: firebase-admin no instalado. Ejecuta: pip install firebase-admin")
    sys.exit(1)

# ── Configuración ──────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
KEY_PATH = os.path.join(SCRIPT_DIR, "serviceAccountKey.json")
MARK_PATH = os.path.join(SCRIPT_DIR, "sync_checkpoint.json")

# Importar funciones CRM desde server.py
sys.path.insert(0, SCRIPT_DIR)
try:
    from server import (
        parse_log_date,
        write_comunicacion_note,
        append_to_daily_note,
        update_index,
    )
except ImportError as e:
    print(f"Error importando server.py: {e}")
    sys.exit(1)


def get_last_synced_id():
    if os.path.exists(MARK_PATH):
        with open(MARK_PATH, "r") as f:
            return json.load(f).get("last_id", "")
    return ""


def save_last_synced_id(doc_id):
    with open(MARK_PATH, "w") as f:
        json.dump({"last_id": doc_id}, f)


def sync():
    if not os.path.exists(KEY_PATH):
        print(f"ERROR: No se encuentra {KEY_PATH}")
        print("1. Ve a Firebase Console → Ajustes → Cuentas de servicio")
        print("2. Genera nueva clave privada (Firebase Admin SDK)")
        print("3. Guárdala como 'serviceAccountKey.json' en cotizador/")
        sys.exit(1)

    cred = credentials.Certificate(KEY_PATH)
    firebase_admin.initialize_app(cred)
    db = firestore.client()

    last_id = get_last_synced_id()
    print(f"Última cotización sincronizada: {last_id or '(ninguna)'}")

    # Leer cotizaciones no sincronizadas
    docs = (
        db.collection("cotizaciones")
        .where("synced", "==", False)
        .order_by("created_at", direction=firestore.Query.ASCENDING)
        .stream()
    )

    count = 0
    synced_ids = []

    for doc in docs:
        entry = doc.to_dict()
        doc_id = doc.id
        print(f"\nProcesando {doc_id} — {entry.get('client_name', '?')}")

        iso_date, weekday = parse_log_date(entry.get("date", ""))
        com_file = write_comunicacion_note(entry, iso_date)
        append_to_daily_note(
            iso_date,
            weekday,
            com_file,
            doc_id,
            entry.get("client_name", "Desconocido"),
            entry.get("total_net_usd", "0"),
            entry.get("average_margin", "0"),
            entry.get("estado", "emitida"),
        )
        update_index(com_file, doc_id, iso_date, entry.get("client_name", "Desconocido"), entry.get("total_net_usd", "0"))
        synced_ids.append(doc_id)
        count += 1

    if count == 0:
        print("No hay cotizaciones pendientes de sincronizar.")
        return

    # Marcar como sincronizadas en Firestore
    batch = db.batch()
    for doc_id in synced_ids:
        batch.update(db.collection("cotizaciones").document(doc_id), {"synced": True})
    batch.commit()

    save_last_synced_id(synced_ids[-1])
    print(f"\n✅ {count} cotizaciones sincronizadas al vault.")


if __name__ == "__main__":
    sync()
