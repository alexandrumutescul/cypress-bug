const fs = require('fs');
const path = require('path');

const webAppStructure = {
    'web-app': {
        'frontend': {
            'index.html': '',
            'main.js': '',
            'styles.css': '',
        },
        'backend': {
            'server.js': '',
            'users.json': '[]',
        },
        'package.json': '',
    },
};

function createDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function createFile(filePath, content) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
    }
}

function createStructure(basePath, structure) {
    for (const item in structure) {
        const itemPath = path.join(basePath, item);
        if (typeof structure[item] === 'object') {
            createDirectory(itemPath);
            createStructure(itemPath, structure[item]);
        } else {
            createFile(itemPath, structure[item]);
        }
    }
}

createStructure('.', webAppStructure);
