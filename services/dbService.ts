
import { SiteData } from "../types";

const DB_NAME = "DMG_Ecosystem_DB";
const DB_VERSION = 2;
const STORE_NAME = "site_config";
const CONFIG_KEY = "current_config";

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (event: any) => resolve(event.target.result);
    request.onerror = (event: any) => reject(event.target.error);
  });
};

/**
 * Global Data Fetching Strategy:
 * 1. Try to load from visitor's LocalStorage/IndexedDB (for personal edits)
 * 2. If nothing local, try to fetch 'site_data.json' from the root of the website
 * 3. Fallback to hardcoded INITIAL_DATA
 */
export const loadSiteData = async (initialFallback: SiteData): Promise<SiteData> => {
  // Check Local Browser DB first (so the Admin sees their own live edits)
  try {
    const db = await initDB();
    const localData = await new Promise<SiteData | null>((resolve) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(CONFIG_KEY);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });

    if (localData) return localData;
  } catch (e) {
    console.warn("IndexedDB not available, checking for server-side config.");
  }

  // Check for the "Published" file on the Coolify server
  // Try /api/site_data.json first (bypasses Traefik routing), then fallback to /site_data.json
  const jsonPaths = ['/api/site_data.json', '/site_data.json'];
  
  for (const jsonPath of jsonPaths) {
    try {
      console.log(`Attempting to load ${jsonPath} from server...`);
      const startTime = performance.now();
      const response = await fetch(jsonPath, {
        cache: 'no-cache',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (response.ok) {
        const contentLength = response.headers.get('content-length');
        const sizeMB = contentLength ? (parseInt(contentLength) / 1024 / 1024).toFixed(2) : 'unknown';
        console.log(`✅ ${jsonPath} loaded (${sizeMB}MB) - parsing...`);
        
        // Use streaming reader for large files to show progress
        const reader = response.body?.getReader();
        if (reader) {
          const chunks: Uint8Array[] = [];
          let received = 0;
          const total = contentLength ? parseInt(contentLength) : 0;
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            received += value.length;
            if (total > 0 && received % (1024 * 1024) === 0) {
              const progress = ((received / total) * 100).toFixed(0);
              console.log(`Loading: ${progress}% (${(received / 1024 / 1024).toFixed(2)}MB / ${sizeMB}MB)`);
            }
          }
          
          const text = new TextDecoder().decode(new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0)));
          const allChunks = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
          let offset = 0;
          for (const chunk of chunks) {
            allChunks.set(chunk, offset);
            offset += chunk.length;
          }
          const finalText = new TextDecoder().decode(allChunks);
          
          console.log(`✅ Downloaded ${(finalText.length / 1024 / 1024).toFixed(2)}MB - parsing JSON...`);
          const parseStart = performance.now();
          
          try {
            const publishedData = JSON.parse(finalText);
            const parseTime = ((performance.now() - parseStart) / 1000).toFixed(2);
            const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);
            console.log(`✅ JSON parsed in ${parseTime}s (total: ${totalTime}s)`);
            console.log(`Roster items: ${publishedData.roster?.length || 0}`);
            return publishedData;
          } catch (parseError: any) {
            console.error(`❌ JSON parse error for ${jsonPath}:`, parseError.message);
            continue;
          }
        } else {
          // Fallback to text() if streaming not available
          const text = await response.text();
          console.log(`✅ Downloaded ${(text.length / 1024 / 1024).toFixed(2)}MB - parsing JSON...`);
          try {
            const publishedData = JSON.parse(text);
            console.log("✅ JSON parsed successfully");
            return publishedData;
          } catch (parseError: any) {
            console.error(`❌ JSON parse error for ${jsonPath}:`, parseError.message);
            continue;
          }
        }
      } else {
        console.warn(`⚠️ ${jsonPath} returned status ${response.status}: ${response.statusText}`);
        continue;
      }
    } catch (e: any) {
      console.error(`❌ Error fetching ${jsonPath}:`, e.message);
      continue;
    }
  }
  
  console.log("No published site_data.json found on server. Using default template.");

  return initialFallback;
};

export const saveSiteData = async (data: SiteData): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(data, CONFIG_KEY);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const clearDatabase = async (): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
