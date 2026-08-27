const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.logCotizacion = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Solo POST permitido' });
    return;
  }

  const entry = req.body;
  if (!entry || !entry.document_no) {
    res.status(400).json({ error: 'document_no es requerido' });
    return;
  }

  entry.created_at = admin.firestore.FieldValue.serverTimestamp();
  entry.synced = false;

  return db.collection('cotizaciones').doc(entry.document_no).set(entry)
    .then(() => res.status(200).json({ status: 'success', message: 'Cotización guardada en Firestore' }))
    .catch((err) => {
      console.error('Firestore error:', err);
      res.status(500).json({ error: err.message });
    });
});

exports.getProductOverrides = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  return db.collection('product_overrides').get()
    .then((snapshot) => {
      const overrides = {};
      snapshot.forEach(doc => {
        overrides[doc.id] = doc.to_dict();
      });
      res.status(200).json(overrides);
    })
    .catch((err) => {
      console.error('Firestore error:', err);
      res.status(500).json({ error: err.message });
    });
});

exports.updateProductOverride = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Solo POST permitido' });
    return;
  }

  const entry = req.body;
  if (!entry || !entry.pn) {
    res.status(400).json({ error: 'pn es requerido' });
    return;
  }

  return db.collection('product_overrides').doc(entry.pn).set(entry)
    .then(() => res.status(200).json({ status: 'success', message: 'Override guardado en Firestore' }))
    .catch((err) => {
      console.error('Firestore error:', err);
      res.status(500).json({ error: err.message });
    });
});

