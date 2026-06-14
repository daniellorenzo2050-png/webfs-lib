/**
 * WebFS.js - Virtual Storage Engine
 * Versão 1.0.0
 */

export class WebFS {
    constructor(config = {}) {
        this.mountPoint = config.mountPoint || '/';
        this.cacheEnabled = config.cache || true;
        this.maxFileSize = 4294967295; // 4GB Limit
    }

    // Valida o tamanho do arquivo para arquitetura 32/64
    _validateSize(size) {
        if (size > this.maxFileSize) {
            throw new Error("WebFS: File size exceeds the limit of 4GB.");
        }
    }

    /**
     * Lê um arquivo via stream (Range Request)
     */
    async readFile(url, offset = 0, length = null) {
        const headers = {
            'Range': `bytes=${offset}-${length ? offset + length - 1 : ''}`
        };

        const response = await fetch(url, { headers });
        
        if (!response.ok) throw new Error(`WebFS Error: ${response.statusText}`);
        
        const data = await response.arrayBuffer();
        this._validateSize(data.byteLength);
        
        return data;
    }

    /**
     * Aplica o Shader (.swebfs) na pasta
     */
    async applyShader(shaderPath) {
        try {
            const response = await fetch(shaderPath);
            const shaderData = await response.json();
            console.log("WebFS: Shader aplicado com sucesso", shaderData.theme);
            return shaderData;
        } catch (e) {
            console.error("WebFS: Falha ao carregar shader, usando fallback.");
            return { theme: "default" };
        }
    }
}
