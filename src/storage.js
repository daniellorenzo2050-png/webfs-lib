/**
 * WebFS Storage Engine
 * Gerencia o cache local dos arquivos via IndexedDB
 */

export class WebFSStorage {
    constructor(dbName = "WebFS_Cache") {
        this.dbName = dbName;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                db.createObjectStore("files", { keyPath: "path" });
            };

            request.onsuccess = (e) => {
                this.db = e.target.result;
                resolve();
            };

            request.onerror = (e) => reject("Erro ao abrir WebFS Storage");
        });
    }

    async saveFile(path, data, metadata = {}) {
        const tx = this.db.transaction("files", "readwrite");
        tx.objectStore("files").put({
            path,
            data,
            metadata,
            timestamp: Date.now()
        });
    }

    async getFile(path) {
        return new Promise((resolve) => {
            const tx = this.db.transaction("files", "readonly");
            const request = tx.objectStore("files").get(path);
            request.onsuccess = () => resolve(request.result);
        });
    }

    async deleteFile(path) {
        const tx = this.db.transaction("files", "readwrite");
        tx.objectStore("files").delete(path);
    }
}
