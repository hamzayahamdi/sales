const fs = require('fs');
const path = require('path');

// List of files/directories we want to keep
const keepFiles = [
    // Core files
    'src/App.jsx',
    'src/main.jsx',
    'src/index.html',
    'src/config/mui.js',
    
    // Essential pages
    'src/pages/DashboardA',
    'src/pages/Login.jsx',
    'src/pages/PageNotFound.jsx',
    
    // Components
    'src/components/Loader.jsx',
    'src/components/ScrollToTop.jsx',
    'src/components/ProtectedRoute.jsx',
    
    // Contexts
    'src/contexts/themeContext.jsx',
    
    // Styles
    'src/styles/theme.js',
    'src/styles/index.scss',
    
    // Assets
    'src/fonts/icomoon',
];

// Directories to clean
const directoriesToClean = [
    'src/pages',
    'src/components',
    'src/widgets',
    'src/layouts',
    'src/assets',
    'src/hooks',
    'src/utils',
];

function shouldKeepFile(filePath) {
    return keepFiles.some(keepPath => filePath.includes(keepPath));
}

function cleanDirectory(directory) {
    if (!fs.existsSync(directory)) {
        console.log(`Directory doesn't exist: ${directory}`);
        return;
    }

    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Recursively clean subdirectories
            cleanDirectory(filePath);
            
            // Remove empty directories
            const remainingFiles = fs.readdirSync(filePath);
            if (remainingFiles.length === 0) {
                fs.rmdirSync(filePath);
                console.log(`Removed empty directory: ${filePath}`);
            }
        } else {
            // Check if file should be kept
            if (!shouldKeepFile(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Removed file: ${filePath}`);
            } else {
                console.log(`Kept file: ${filePath}`);
            }
        }
    });
}

// Run the cleanup
console.log('Starting cleanup...');
directoriesToClean.forEach(dir => {
    console.log(`\nCleaning directory: ${dir}`);
    cleanDirectory(dir);
});
console.log('\nCleanup complete!'); 