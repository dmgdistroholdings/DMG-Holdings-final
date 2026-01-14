#!/bin/bash
# Rebuild and deploy DMG with latest fixes - Run this on the server

cd /tmp

if [ ! -d "dmg-build" ]; then
    git clone https://github.com/dmgdistroholdings/DMG-Holdings-final.git dmg-build
    cd dmg-build
else
    cd dmg-build
    git pull
fi

# Remove importmap from source
sed -i '/<script type="importmap">/,/<\/script>/d' index.html 2>/dev/null || true

# Ensure entry script exists
if ! grep -q '<script type="module" src="/index.tsx"></script>' index.html; then
    sed -i 's|</body>|    <script type="module" src="/index.tsx"></script>\n</body>|' index.html
fi

# Build
rm -rf dist node_modules/.vite
npm install
npm run build

# Deploy
DMG=$(docker ps -q --filter "name=f8cgk888s8wgko80ogc0os4g" | tail -1)
if [ ! -z "$DMG" ]; then
    docker cp dist/. $DMG:/usr/share/nginx/html/
    docker exec $DMG sh -c "rm -rf /usr/share/nginx/html/src /usr/share/nginx/html/components /usr/share/nginx/html/services /usr/share/nginx/html/*.tsx /usr/share/nginx/html/*.ts /usr/share/nginx/html/package*.json /usr/share/nginx/html/node_modules 2>/dev/null; nginx -s reload"
    echo "✅ Deployed! Refresh browser"
else
    echo "❌ Container not found"
fi
