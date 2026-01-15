
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
  try {
    console.log("Attempting to load /site_data.json from server...");
    const response = await fetch('/site_data.json', {
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (response.ok) {
      console.log(`✅ site_data.json loaded successfully (${response.headers.get('content-length')} bytes)`);
      const text = await response.text();
      console.log(`JSON text length: ${text.length} characters`);
      
      try {
        const publishedData = JSON.parse(text);
        console.log("✅ JSON parsed successfully");
        console.log(`Roster items: ${publishedData.roster?.length || 0}`);
        console.log(`First artist has image: ${!!publishedData.roster?.[0]?.image}`);
        console.log(`First image type: ${publishedData.roster?.[0]?.image?.substring(0, 30) || 'none'}`);
        return publishedData;
      } catch (parseError: any) {
        console.error("❌ JSON parse error:", parseError.message);
        console.error("First 500 chars of response:", text.substring(0, 500));
      }
    } else {
      console.warn(`⚠️ site_data.json returned status ${response.status}: ${response.statusText}`);
    }
  } catch (e: any) {
    console.error("❌ Error fetching site_data.json:", e.message);
    console.log("Falling back to default template.");
  }

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
