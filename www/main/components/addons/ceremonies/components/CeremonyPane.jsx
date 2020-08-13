import React from 'react';
import PropTypes from 'prop-types';
import { remote } from 'electron';

import { Switch, Tile } from '../../../../sttm-ui';
import getUserPreferenceForEnglishExp from '../utils/get-user-preference-for-english-exp';

const { store, i18n } = remote.require('./app');
const analytics = remote.getGlobal('analytics');

const CeremonyPane = props => {
  const { token, name, id, onScreenClose } = props;
  const paneId = token;

  const loadCeremony = theme => () => {
    analytics.trackEvent('ceremony', token);
    global.core.search.loadCeremony(id).catch(error => {
      analytics.trackEvent('ceremonyFailed', id, error);
    });
    global.core.copy.loadFromDB(token, 'ceremony');
    onScreenClose();
  };

  const showEnglishExplainations = isEnglishExplainations => {
    store.setUserPref(`gurbani.ceremonies.ceremony-${token}-english`, isEnglishExplainations);
    global.platform.updateSettings();

    global.core.search.loadCeremony(id).catch(error => {
      analytics.trackEvent('ceremonyFailed', id, error);
    });
    global.core.copy.loadFromDB(token, 'ceremony');
  };

  return (
    <div className="ceremony-pane" id={paneId}>
      <header className="toolbar-nh navigator-header">
        <span className="gurmukhi">{name}</span>
      </header>
      <div className="ceremony-pane-content">
        <div className="ceremony-pane-options" id={`cpo-${paneId}`}>
          <Switch
            onToggle={showEnglishExplainations}
            defaultValue={getUserPreferenceForEnglishExp(token)}
            title={i18n.t('TOOLBAR.ENG_EXPLANATIONS')}
            controlId={`${name}-english-exp-toggle`}
            className={`${name}-english-exp-switch`}
          />

          <div className="ceremony-pane-themes">
            <div className="ceremony-theme-header"> {i18n.t('TOOLBAR.CHOOSE_THEME')} </div>

            <Tile onClick={loadCeremony('LIGHT')} className="theme-instance" theme="LOW_LIGHT">
              LIGHT
            </Tile>

            <Tile onClick={loadCeremony('FLORAL')} className="theme-instance" theme="FLORAL">
              FLORAL
            </Tile>

            <Tile onClick={loadCeremony('FLORAL')} className="theme-instance" theme="FLORAL">
              CURRENT THEME
            </Tile>
          </div>
        </div>
      </div>
    </div>
  );
};

CeremonyPane.propTypes = {
  onScreenClose: PropTypes.func,
  id: PropTypes.number,
  name: PropTypes.string,
  token: PropTypes.string,
};

export default CeremonyPane;
