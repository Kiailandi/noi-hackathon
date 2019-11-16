import { html } from 'lit-html';
import icon_center from '../icons/blue/icon_localization_blue.png';
import icon_minus from '../icons/grey/icon_minus_grey.png';
import icon_plus from '../icons/grey/icon_plus_grey.png';
import icon_full_screen_maximize_grey from '../icons/grey/icon_full_screen_maximize_grey.png';
import icon_full_screen_minimize_grey from '../icons/grey/icon_full_screen_minimize_grey.png';

export const render__map_controls = (isFullScreen, handleFullScreenMap) => {
  return html`
    <div class="controls_container">
      <div
        @click="${handleFullScreenMap}"
        class="${isFullScreen ? 'mb-2' : ''} d-flex align-items-center justify-content-center d-lg-none mb-lg-3 control"
      >
        <img src="${isFullScreen ? icon_full_screen_minimize_grey : icon_full_screen_maximize_grey}" alt="" />
      </div>
      <div
        id="centerMap"
        class="${isFullScreen
          ? 'd-flex'
          : 'd-none'} d-lg-flex align-items-center justify-content-center mb-2 mb-lg-3 control"
      >
        <div>
          <img src="${icon_center}" alt="" />
        </div>
      </div>
      <div
        id="zoomMapIn"
        class="${isFullScreen ? 'd-flex' : 'd-none'} d-lg-flex align-items-center justify-content-center control"
      >
        <div>
          <img src="${icon_plus}" alt="" />
        </div>
      </div>
      <div class="controls_container__divider ${isFullScreen ? '' : 'd-none d-lg-block'}"><div></div></div>
      <div
        id="zoomMapOut"
        class="${isFullScreen ? 'd-flex' : 'd-none'} d-lg-flex align-items-center justify-content-center control"
      >
        <div>
          <img src="${icon_minus}" alt="" />
        </div>
      </div>
    </div>
  `;
};
