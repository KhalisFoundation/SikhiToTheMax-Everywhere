/* eslint import/no-unresolved: 0 */
global.electron = true;
global.mainWindow = true;

const fs = require('fs');
const path = require('path');
global.platform = require('./js/desktop_scripts');
global.controller = require('./js/controller');
global.core = require('./core/js/index');

// Pull in navigator from core
const navigator = fs.readFileSync(path.resolve(__dirname, 'core/navigator.html'));
document.querySelector('#navigator').innerHTML = navigator;
global.core.search.init();
global.core.menu.init();
global.core.themeEditor.init();
global.platform.init();

document.body.classList.add(process.platform);
