const h = require('hyperscript');
const Noty = require('noty');
const fs = require('fs');
const path = require('path');
const util = require('util');
const imagemin = require('imagemin');
const { remote } = require('electron');
const readChunk = require('read-chunk');
const imageType = require('image-type');

const themes = require('./themes.json');

const mkdir = util.promisify(fs.mkdir);
const userDataPath = remote.app.getPath('userData');
const userBackgroundsPath = path.resolve(userDataPath, 'user_backgrounds');

const { store, analytics } = remote.require('./app');

const defaultTheme = themes[0];

const themesWithCustomBg = themes
                            .filter(theme => theme.type === 'COLOR' || theme.type === 'SPECIAL')
                            .map(theme => theme.key);

/*
 * Helper Functions
 */

const uploadErrorNotification = (message) => {
  new Noty({
    type: 'error',
    text: message,
    timeout: 3000,
    modal: true,
  }).show();
};

const imageCheck = (filePath) => {
  const acceptedExtensions = ['png', 'jpg'];
  const acceptedMimeTypes = ['image/png', 'image/jpeg'];

  try {
    const buffer = readChunk.sync(filePath, 0, 12);
    const fileMeta = imageType(buffer);
    if (fileMeta) {
      return acceptedExtensions.includes(fileMeta.ext) && acceptedMimeTypes.includes(fileMeta.mime);
    }
  } catch (error) {
    uploadErrorNotification(`Failed to validate this file as an image. 
      Error: ${error}. If error presists file a bug report at sttm.co`);
  }

  return false;
};

/*
 * DOM Factories
 */

const recentSwatchFactory = backgroundPath =>
  h(
    'li.theme-instance.custom-bg',
    {
      style: {
        'background-image': `url(${backgroundPath.replace(/(\s)/g, '\\ ')})`,
      },
      onclick: () => {
        store.setUserPref('app.theme', themesWithCustomBg[0]);
        store.setUserPref('app.themebg', {
          type: 'custom',
          url: backgroundPath.replace(/(\s)/g, '\\ '),
        });
        global.core.platformMethod('updateSettings');
      },
    },
    h(
      'button.delete-btn',
      {
        onclick: (evt) => {
          evt.stopPropagation();
          fs.unlink(backgroundPath, (error) => {
            if (error) {
              uploadErrorNotification(`Unable to delete that image. Press cmd+r / ctrl+r to refresh. - ${error}`);
            } else {
              evt.target.parentNode.parentNode.classList.add('delete-animate');
            }
          });
        },
      },
      h('i.fa.fa-trash-o'),
    ),
  );


const upsertCustomBackgrounds = (themesContainer) => {
  document.querySelectorAll('.custom-bg').forEach((swatch) => {
    swatch.remove();
  });
  fs.readdir(userBackgroundsPath, (error, files) => {
    if (error) {
      uploadErrorNotification(`Unable to get existing custom background files - ${error}`);
    } else {
      files.forEach((file) => {
        const filePath = path.resolve(userBackgroundsPath, file);
        if (imageCheck(filePath)) {
          themesContainer.appendChild(recentSwatchFactory(filePath));
        }
      });
    }
  });
};


const swatchFactory = (themeInstance, isCustom) =>
  h(
    'li.theme-instance',
    {
      style: {
        'background-color': themeInstance['background-color'],
        'background-image': themeInstance['background-image'] ? `url(assets/img/custom_backgrounds/${themeInstance['background-image']})` : 'none',
      },
      onclick: () => {
        try {
          document.body.classList.remove(store.getUserPref('app.theme'));
          store.setUserPref('app.theme', themeInstance.key);
          if (!isCustom) {
            store.setUserPref('app.themebg', {
              type: 'default',
              url: `assets/img/custom_backgrounds/${themeInstance['background-image-full']}`,
            });
          }
          document.body.classList.add(themeInstance.key);
          global.core.platformMethod('updateSettings');
          analytics.trackEvent('theme', themeInstance.key);
        } catch (error) {
          uploadErrorNotification(`There was an error parsing this theme. If the error presists contact sttm.co ${error}`);
        }
      },
    },
    h(
      `span.${themeInstance.name}`,
      {
        style: {
          color: themeInstance['gurbani-color'],
        },
      },
      themeInstance.name));

const swatchHeaderFactory = headerText => h('header.options-header', headerText);

const imageInput = themesContainer =>
  h(
    'label.file-input-label',
    {
      for: 'themebg-upload',
    },
    'Choose a file',
    h('input.file-input#themebg-upload',
      {
        type: 'file',
        accept: '*.png',
        onchange: async (evt) => {
          // const curTheme = store.getUserPref('app.theme');

          // if (!themesWithCustomBg.includes(curTheme)) {
          store.setUserPref('app.theme', themesWithCustomBg[0]);
          // }


          try {
            if (!fs.existsSync(userBackgroundsPath)) await mkdir(userBackgroundsPath);
          } catch (error) {
            uploadErrorNotification(`There was an error using this image. If error persists, report it at www.sttm.co: Error Creating Directory - ${error}`);
          }

          try {
            if (imageCheck(evt.target.files[0].path)) {
              const files = await imagemin([evt.target.files[0].path], userBackgroundsPath);
              if (files) {
                store.setUserPref('app.themebg', {
                  type: 'custom',
                  url: `${files[0].path}`.replace(/(\s)/g, '\\ '),
                });
                themesContainer.appendChild(recentSwatchFactory(files[0].path));
                analytics.trackEvent('theme', 'custom');
                global.core.platformMethod('updateSettings');
              }
            } else {
              throw new Error('Only .png and .jpg images are allowed.');
            }
          } catch (error) {
            uploadErrorNotification(`There was an error using this file. If error persists, report it at www.sttm.co: ${error}`);
          }
        },
      },
    ),
  );

const swatchGroupFactory = (themeType, themesContainer, isCustom) => {
  themes.forEach((themeInstance) => {
    if (themeInstance.type === themeType) {
      themesContainer.appendChild(swatchFactory(themeInstance, isCustom));
    }
  });
};


module.exports = {
  defaultTheme,
  init() {
    const themeOptions = document.querySelector('#custom-theme-options');

    themeOptions.appendChild(swatchHeaderFactory('Colours'));
    swatchGroupFactory('COLOR', themeOptions);

    themeOptions.appendChild(swatchHeaderFactory('Backgrounds'));
    swatchGroupFactory('BACKGROUND', themeOptions);

    themeOptions.appendChild(swatchHeaderFactory('Special Conditions'));
    swatchGroupFactory('SPECIAL', themeOptions);

    themeOptions.appendChild(swatchHeaderFactory('New Custom background'));
    themeOptions.appendChild(imageInput(themeOptions));

    themeOptions.appendChild(swatchHeaderFactory('Recent custom backgrounds'));
    upsertCustomBackgrounds(themeOptions);


    /* themeOptions.appendChild(swatchHeaderFactory('Custom background themes'));
    swatchGroupFactory('COLOR', themeOptions, true);
    swatchGroupFactory('SPECIAL', themeOptions, true); */
  },
};
