// ---------- Device-local persistence (IndexedDB) ----------
// Everything the couple writes — journal captions, photos, roses, confessional
// answers, badges — lives here on THIS device only. Never uploaded anywhere
// (invariant #8). Promise-wrapped so the rest of the app can await cleanly.
const Store = (() => {
  const DB_NAME = "honeymoon";
  const DB_VERSION = 2; // v2 adds the quests store
  // keyPath per store: journal/roses/confessional keyed by date; photos by id;
  // badges/quests by id; kv by key. onupgradeneeded creates any store not yet
  // present, so bumping DB_VERSION + adding here is all a new store needs.
  const STORES = {
    journal:      "date",
    photos:       "id",
    roses:        "date",
    confessional: "date",
    badges:       "id",
    quests:       "id",
    kv:           "key"
  };

  let dbPromise = null;
  function open() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        for (const [name, keyPath] of Object.entries(STORES)) {
          if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }

  function tx(store, mode, fn) {
    return open().then(db => new Promise((resolve, reject) => {
      const t = db.transaction(store, mode);
      const os = t.objectStore(store);
      const req = fn(os);
      t.oncomplete = () => resolve(req && req.result);
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error);
    }));
  }

  return {
    get:  (store, key) => tx(store, "readonly",  os => os.get(key)),
    put:  (store, obj) => tx(store, "readwrite", os => os.put(obj)),
    all:  (store)      => tx(store, "readonly",  os => os.getAll()),
    del:  (store, key) => tx(store, "readwrite", os => os.delete(key))
  };
})();

// Downscale a picked image to a reasonable size before storing as a Blob, so a
// full scrapbook doesn't blow past IndexedDB quotas. Max edge 1600px, JPEG q0.82.
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const maxEdge = 1600;
      let { width, height } = img;
      const scale = Math.min(1, maxEdge / Math.max(width, height));
      width = Math.round(width * scale);
      height = Math.round(height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error("toBlob failed")),
        "image/jpeg", 0.82
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("image load failed")); };
    img.src = url;
  });
}
