const fs = require('fs');
const path = require('path');

// Generate new version number based on timestamp
const newVersion = `1.0.${Date.now()}`;

// Update version.json
const versionJsonPath = path.join(__dirname, 'public', 'version.json');
fs.writeFileSync(versionJsonPath, JSON.stringify({ version: newVersion }, null, 4));

// Update App.jsx
const appJsxPath = path.join(__dirname, 'src', 'App.jsx');
let appContent = fs.readFileSync(appJsxPath, 'utf8');
appContent = appContent.replace(
    /const APP_VERSION = ['"].*?['"]/,
    `const APP_VERSION = '${newVersion}'`
);
fs.writeFileSync(appJsxPath, appContent);

console.log(`Version updated to ${newVersion}`); 