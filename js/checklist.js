// Editable, persisted checklists — seeded once from TripData, then user-owned (mirrors the
// Android/iOS ChecklistStore approach: localStorage instead of DataStore/UserDefaults).
const ChecklistStore = (() => {
  const KEYS = { packing: "hm_packing_v1", prep: "hm_prep_v1" };
  let nextId = Date.now();

  function newId() { return "c" + (nextId++); }

  function seed(list) {
    return list.map(g => ({
      heading: g.heading,
      items: g.items.map(text => ({ id: newId(), text, checked: false }))
    }));
  }

  function load(key, sourceList) {
    const raw = localStorage.getItem(key);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fall through to reseed */ }
    }
    const seeded = seed(sourceList);
    localStorage.setItem(key, JSON.stringify(seeded));
    return seeded;
  }

  function save(key, groups) {
    localStorage.setItem(key, JSON.stringify(groups));
  }

  return {
    getPacking() { return load(KEYS.packing, TripData.packingList); },
    getPrep() { return load(KEYS.prep, TripData.prepChecklist); },
    savePacking(groups) { save(KEYS.packing, groups); },
    savePrep(groups) { save(KEYS.prep, groups); },
    newId
  };
})();
