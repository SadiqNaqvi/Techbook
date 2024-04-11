let db;

function openIDB(nameOfDB, objStore, keyForStore) {
  const request = indexedDB.open(
    nameOfDB && typeof nameOfDB === "string" ? nameOfDB : "My Database"
  );

  request.onupgradeneeded = (res) => {
    const db = res.target.result;
    if (objStore) {
      if (typeof objStore === "string")
        db.createObjectStore(
          objStore,
          keyForStore
            ? { keyPath: keyForStore }
            : { keyPath: "key", autoIncrement: true }
        );
      else if (typeof objStore === "object") {
        if (Array.from(objStore).length)
          objStore.forEach((element) => {
            if (typeof element === "string")
              db.createObjectStore(element, {
                keyPath: "key",
                autoIncrement: true,
              });
            else if (typeof element === "object")
              db.createObjectStore(
                element.name,
                element.key
                  ? { keyPath: element.key }
                  : { keyPath: "key", autoIncrement: true }
              );
            else throw Error("Invalid name for the store!");
          });
        else
          throw new TypeError(
            `Invalid type of parameter for name of store. Expected string or array, instead got ${typeof objStore}`
          );
      } else
        throw new TypeError(
          `Invalid type of parameter for name of store. Expected string or array, instead got ${typeof objStore}`
        );
    } else
      db.createObjectStore("My Store", { keyPath: "key", autoIncrement: true });
  };

  request.onsuccess = (res) => (db = res.target.result);
  request.onerror = (err) => {
    throw Error(
      `Something went wrong while opening IndexedDB! ${err.target.error}`
    );
  };
}

function addToIDB(element, nameOfStore) {
  if (db && element) {
    if (!nameOfStore)
      return new Promise((resolve, reject) => {
        const request = db
          .transaction(["My Store"], "readwrite")
          .objectStore("My Store")
          .add(element);
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (event) => reject(event.target.errorCode);
      });
    else if (typeof nameOfStore === "string")
      return new Promise((resolve, reject) => {
        const request = db
          .transaction([nameOfStore], "readwrite")
          .objectStore(nameOfStore)
          .add(element);
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (event) => reject(event.target.errorCode);
      });
    else
      throw TypeError(
        `Invalid type of parameter for name of store. Expected string instead got ${typeof nameOfStore}`
      );
  } else {
    if (db) throw Error(`Expected a valid element instead got ${element}!`);
    else throw Error("IndexedDB is not opened yet!");
  }
}

function updateInIDB(element, nameOfStore) {
  if (db && element) {
    if (!nameOfStore)
      return new Promise((resolve, reject) => {
        const request = db
          .transaction(["My Store"], "readwrite")
          .objectStore("My Store")
          .put(element);
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (event) => reject(event.target.errorCode);
      });
    else if (typeof nameOfStore === "string")
      return new Promise((resolve, reject) => {
        const request = db
          .transaction([nameOfStore], "readwrite")
          .objectStore(nameOfStore)
          .put(element);
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (event) => reject(event.target.errorCode);
      });
    else
      throw Error(
        `Invalid type of parameter for name of store. Expected string instead got ${typeof nameOfStore}`
      );
  } else {
    if (db) throw Error(`Expected a valid element instead got ${element}!`);
    else throw Error("IndexedDB is not opened yet!");
  }
}

function deleteInIDB(keyOfElement, nameOfStore) {
  if (db && keyOfElement) {
    if (!nameOfStore)
      return new Promise((resolve, reject) => {
        const request = db
          .transaction(["My Store"], "readwrite")
          .objectStore("My Store")
          .delete(keyOfElement);
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (event) => reject(event.target.errorCode);
      });
    else if (typeof nameOfStore === "string")
      return new Promise((resolve, reject) => {
        const request = db
          .transaction([nameOfStore], "readwrite")
          .objectStore(nameOfStore)
          .delete(keyOfElement);
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (event) => reject(event.target.errorCode);
      });
    else
      throw Error(
        `Invalid type of parameter for name of store. Expected string instead got ${typeof nameOfStore}`
      );
  } else {
    if (db)
      throw Error(
        `Expected a valid key of the element instead got ${keyOfElement}!`
      );
    else throw Error("IndexedDb is not opened yet");
  }
}

function fetchAllFromIDB(nameOfStore) {
  if (!nameOfStore)
    return new Promise((resolve, reject) => {
      const request = db
        .transaction(["My Store"], "readonly")
        .objectStore("My Store")
        .getAll();

      request.onsuccess = (e) => resolve(e.target.result);

      request.onerror = (e) => reject(e.target.errorCode);
    });
  else if (typeof nameOfStore === "string")
    return new Promise((resolve, reject) => {
      const request = db
        .transaction([nameOfStore], "readonly")
        .objectStore(nameOfStore)
        .getAll();

      request.onsuccess = (e) => resolve(e.target.result);

      request.onerror = (e) => reject(e.target.errorCode);
    });
  else
    throw Error(
      `Invalid type of parameter for name of store. Expected string instead got ${typeof nameOfStore}`
    );
}

function fetchFromIDB(keyOfElement, nameOfStore) {
  if (db && keyOfElement) {
    if (!nameOfStore)
      return new Promise((resolve, reject) => {
        const request = db
          .transaction(["My Store"], "readwrite")
          .objectStore("My Store")
          .get(keyOfElement);
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (event) => reject(event.target.errorCode);
      });
    else if (typeof nameOfStore === "string")
      return new Promise((resolve, reject) => {
        const request = db
          .transaction([nameOfStore], "readwrite")
          .objectStore(nameOfStore)
          .get(keyOfElement);
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (event) => reject(event.target.errorCode);
      });
    else
      throw Error(
        `Invalid type of parameter for name of store. Expected string instead got ${typeof nameOfStore}`
      );
  } else {
    if (db)
      throw Error(
        `Expected a valid key of the element instead got ${keyOfElement}!`
      );
    else throw Error("IndexedDB is not opened yet!");
  }
}

export {
  openIDB,
  addToIDB,
  updateInIDB,
  deleteInIDB,
  fetchFromIDB,
  fetchAllFromIDB,
};
