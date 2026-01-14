#!/bin/bash
# Complete fix and deploy for DMG - Run this on server
set -e

echo "🚀 Fixing and deploying DMG Holdings..."

cd /tmp

# Clone or update repo
if [ ! -d "dmg-build" ]; then
    echo "📥 Cloning repository..."
    git clone https://github.com/dmgdistroholdings/DMG-Holdings-final.git dmg-build
    cd dmg-build
else
    echo "📥 Updating repository..."
    cd dmg-build
    git pull
fi

# Fix index.html - remove importmap, ensure entry script
echo "🔧 Fixing index.html..."
sed -i '/<script type="importmap">/,/<\/script>/d' index.html 2>/dev/null || true

if ! grep -q '<script type="module" src="/index.tsx"></script>' index.html; then
    sed -i 's|</body>|    <script type="module" src="/index.tsx"></script>\n</body>|' index.html
    echo "✅ Added entry script tag"
fi

# Build
echo "🔨 Building application..."
rm -rf dist node_modules/.vite
npm install
npm run build

if [ ! -d "dist/assets" ]; then
    echo "❌ Build failed - no assets folder"
    exit 1
fi

JS_FILE=$(ls dist/assets/index-*.js 2>/dev/null | head -1 | xargs basename)
echo "✅ Build successful! JS file: $JS_FILE"

# Ensure built HTML references the JS file
if ! grep -q "$JS_FILE" dist/index.html; then
    echo "⚠️  Fixing built HTML to reference JS file..."
    sed -i "s|</body>|    <script type=\"module\" crossorigin src=\"/assets/$JS_FILE\"></script>\n</body>|" dist/index.html
fi

# Deploy to container
echo "📦 Deploying to container..."
DMG=$(docker ps -q --filter "name=f8cgk888s8wgko80ogc0os4g" | tail -1)

if [ -z "$DMG" ]; then
    echo "❌ Container not found"
    docker ps | grep f8cgk888s8wgko80ogc0os4g
    exit 1
fi

docker cp dist/. $DMG:/usr/share/nginx/html/
docker exec $DMG sh -c "rm -rf /usr/share/nginx/html/src /usr/share/nginx/html/components /usr/share/nginx/html/services /usr/share/nginx/html/*.tsx /usr/share/nginx/html/*.ts /usr/share/nginx/html/package*.json /usr/share/nginx/html/node_modules 2>/dev/null; nginx -s reload"

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo "   Site: https://dmg.brandingnovations.com"
echo "   Refresh your browser to see the changes"
