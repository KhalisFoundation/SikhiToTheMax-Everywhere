import React from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';

global.platform = require('../../desktop_scripts');

const QuickTools = () => {
  const {
    setTranslationVisibility,
    setTeekaVisibility,
    setTransliterationVisibility,
    setGurbaniFontSize,
    setTranslationFontSize,
    setTeekaFontSize,
    setTransliterationFontSize,
  } = useStoreActions(state => state.userSettings);
  const {
    translationVisibility,
    teekaVisibility,
    transliterationVisibility,
    gurbaniFontSize,
    translationFontSize,
    teekaFontSize,
    transliterationFontSize,
  } = useStoreState(state => state.userSettings);
  const { quickToolsOpen } = useStoreState(state => state.viewerSettings);
  const { setQuickToolsOpen } = useStoreActions(state => state.viewerSettings);

  // quickToolsActions {
  //   'subjects': ['Gurbani', 'translation', 'transliteration', 'teeka'],
  //   'modifiers': 'plus', 'minus', 'visibility',
  // };

  // if (!'gurbani') {
  //   visibilityClassName = true;
  //   actionName = `set${name}FontSize`,
  // };

  const quickToolsActions = [
    {
      name: 'Bani',
      visibilty: null,
      icons: [
        {
          name: 'minus',
          className: `fa fa-minus-circle`,
          action: () => {
            setGurbaniFontSize(gurbaniFontSize - 1);
            global.platform.ipc.send('recieve-setting', {
              actionName: 'setGurbaniFontSize',
              payload: gurbaniFontSize - 1,
              settingType: 'userSettings',
            });
          },
        },
        {
          name: 'plus',
          className: `fa fa-plus-circle`,
          action: () => setGurbaniFontSize(gurbaniFontSize + 1),
        },
      ],
    },
    {
      name: 'Translation',
      visibilty: null,
      icons: [
        {
          name: 'visibility',
          className: `fa fa-eye${!translationVisibility ? '-slash' : ''}`,
          action: () => setTranslationVisibility(!translationVisibility),
        },
        {
          name: 'minus',
          className: `fa fa-minus-circle`,
          action: () => setTranslationFontSize(translationFontSize - 1),
        },
        {
          name: 'plus',
          className: `fa fa-plus-circle`,
          action: () => setTranslationFontSize(translationFontSize + 1),
        },
      ],
    },
    {
      name: 'Teeka',
      visibilty: null,
      icons: [
        {
          name: 'visibility',
          className: `fa fa-eye${!teekaVisibility ? '-slash' : ''}`,
          action: () => setTeekaVisibility(!teekaVisibility),
        },
        {
          name: 'minus',
          className: `fa fa-minus-circle`,
          action: () => setTeekaFontSize(teekaFontSize - 1),
        },
        {
          name: 'plus',
          className: `fa fa-plus-circle`,
          action: () => setTeekaFontSize(teekaFontSize + 1),
        },
      ],
    },
    {
      name: 'Transliteration',
      visibilty: null,
      icons: [
        {
          name: 'visibility',
          className: `fa fa-eye${!transliterationVisibility ? '-slash' : ''}`,
          action: () => setTransliterationVisibility(!transliterationVisibility),
        },
        {
          name: 'minus',
          className: `fa fa-minus-circle`,
          action: () => setTransliterationFontSize(transliterationFontSize - 1),
        },
        {
          name: 'plus',
          className: `fa fa-plus-circle`,
          action: () => setTransliterationFontSize(transliterationFontSize + 1),
        },
      ],
    },
  ];

  const bakeIcons = icons => {
    return icons.map(icon => (
      <div key={icon.name} className="quicktool-icons">
        {<i className={icon.className} onClick={icon.action} />}
      </div>
    ));
  };

  return (
    <div className="slide-quicktools">
      <div className="quicktool-header" onClick={() => setQuickToolsOpen(!quickToolsOpen)}>
        Quick Tools
        <i className={`fa fa-caret-${quickToolsOpen ? 'up' : 'down'}`}></i>
      </div>
      {quickToolsOpen && (
        <div className="quicktool-body">
          {quickToolsActions.map(quickTool => (
            <div key={quickTool.name} className="quicktool-item">
              <div>{quickTool.name}</div>
              <div className="quicktool-icons">{bakeIcons(quickTool.icons)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickTools;
