import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Toolbar from '../toolbar';
import Navigator from '../navigator';
import WorkspaceBar from '../workspace-bar';

import { Ceremonies, SundarGutka, BaniController, LockScreen } from '../addons';

import { DEFAULT_OVERLAY } from '../common/constants';

const Launchpad = () => {
  const { overlayScreen } = useStoreState(state => state.app);
  const { setOverlayScreen } = useStoreActions(actions => actions.app);

  const onScreenClose = React.useCallback(() => {
    setOverlayScreen(DEFAULT_OVERLAY);
  }, [setOverlayScreen, DEFAULT_OVERLAY]);

  const isSundarGutkaOverlay = overlayScreen === 'sunder-gutka';
  const isBaniControllerOverlay = overlayScreen === 'sync-button';
  const isCeremoniesOverlay = overlayScreen === 'ceremonies';
  const isLockScreen = overlayScreen === 'lock-screen';

  return (
    <>
      <WorkspaceBar />
      <div className="launchpad">
        <Toolbar />
        {isSundarGutkaOverlay && <SundarGutka onScreenClose={onScreenClose} />}
        {isBaniControllerOverlay && <BaniController onScreenClose={onScreenClose} />}
        {isCeremoniesOverlay && <Ceremonies onScreenClose={onScreenClose} />}
        {isLockScreen && <LockScreen onScreenClose={onScreenClose} />}

        <Navigator />
      </div>
    </>
  );
};

export default Launchpad;
