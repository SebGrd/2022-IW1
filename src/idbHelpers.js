import { openDB } from 'idb';

const STORE_NAME = "Products";

export function initDB() {
  return openDB("Nozama", 1, {
    upgrade(db) {
      const productsStore = db.createObjectStore(STORE_NAME, {
        keyPath: "id"
      });
      const cartStore = db.createObjectStore("Cart", {
        keyPath: "id"
      });

      productsStore.createIndex("id", "id");
      productsStore.createIndex("category", "category");

      cartStore.createIndex("id", "id");
    }
  });
}

export async function setRessources(data = []) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  data.forEach(item => {
    tx.store.put(item);
  });
  await tx.done;
  return db.getAllFromIndex(STORE_NAME, "id");
}

export async function setRessource(data = {}) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.store.put(data);
  await tx.done;
  return db.getFromIndex(STORE_NAME, "id", data.id);
}


export async function getRessources() {
  const db = await initDB();
  return db.getAllFromIndex(STORE_NAME, "id");
}

export async function getRessource(id) {
  const db = await initDB();
  return db.getFromIndex(STORE_NAME, "id", id);
}

export async function setCart(data = {}) {
  const db = await initDB();
  const tx = db.transaction("Cart", "readwrite");
  tx.store.put(data);
  await tx.done;
  return db.getFromIndex('Cart', "id", data.id);
}

export async function getCart(id) {
  const db = await initDB();
  return db.getFromIndex("Cart", "id", id);
}

export async function unsetRessource(id) {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
}