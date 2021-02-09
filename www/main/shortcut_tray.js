const h = require('hyperscript');
const { remote } = require('electron');
const shortcutItemsJSON = require('../configs/shortcut_tray.json');

const { i18n } = remote.require('./app');

const analytics = remote.getGlobal('analytics');

const shortcutTrayContainer = document.querySelector('.shortcut-tray');

const trayItemFactory = (trayItemKey, trayItem) =>
  h(
    `div.tray-item.${trayItem.labelType}#tray-${trayItemKey}`,
    {
      onclick: () => {
        analytics.trackEvent('shortcutTray', trayItemKey);
        if (trayItem.type === 'text') {
          global.controller.sendText(trayItem.ref, true);
          global.core.updateInsertedSlide(true);
        } else if (trayItem.type === 'shabad') {
          global.core.search.loadShabad(trayItem.ref);
          global.core.updateInsertedSlide(true);
        } else if (trayItem.type === 'ceremony') {
          global.core.search.loadCeremony(trayItem.ref).catch(error => {
            analytics.trackEvent('ceremonyFailed', trayItem.ref, error);
          });
        }
      },
    },
    h(
      'div.tray-item-icon',
      h('div.tray-item-label', i18n.t(`SHORTCUT_TRAY.${trayItem.label}`, trayItem.label)),
    ),
  );

const shortcutsToggle = () => {
  let isShortcutTrayOn = global.getUserSettings.shortcutTray;
  return h(
    'div.shortcut-toggle',
    {
      onclick: () => {
        isShortcutTrayOn = !isShortcutTrayOn;
        analytics.trackEvent('shortcutTrayToggle', isShortcutTrayOn);
        global.setUserSettings.setShortcutTray(isShortcutTrayOn);
        document
          .querySelector('i.shortcut-toggle-icon')
          .classList.toggle('fa-caret-up', !isShortcutTrayOn);
        document
          .querySelector('i.shortcut-toggle-icon')
          .classList.toggle('fa-caret-down', isShortcutTrayOn);
      },
    },
    h(`i.shortcut-toggle-icon.fa.${isShortcutTrayOn ? 'fa-caret-down' : 'fa-caret-up'}`),
  );
};

const clearHistoryBtn = h(
  'button.clear-history',
  {
    onclick: () => {
      global.core.search.clearSession();
    },
  },
  h(`i.clear-history-icon.fa.fa-history`),
  'Clear History',
);

module.exports = {
  init() {
    Object.keys(shortcutItemsJSON).forEach(itemKey => {
      shortcutTrayContainer.appendChild(trayItemFactory(itemKey, shortcutItemsJSON[itemKey]));
    });

    document.querySelector('#footer').appendChild(shortcutsToggle());
    document.querySelector('#footer').appendChild(clearHistoryBtn);
  },
};
