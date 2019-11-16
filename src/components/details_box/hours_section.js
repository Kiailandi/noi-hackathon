import { html } from 'lit-html';
import { t } from '../../translations';
import icon__clock from '../../icons/clock.png';

export const render__hours_section = (accessInfo, lang) => {
  if (!accessInfo) {
    return null;
  }
  let text = '';
  switch (accessInfo) {
    case '24/7':
    case '0-24':
      text = `${t.open_charging_station[lang]} ${accessInfo}`;
      break;

    default:
      text = accessInfo;
      break;
  }

  return html`
    <div class="details_box__section mt-3">
      <div class="col-12 d-flex align-items-center mt-3">
        <div>
          <img class="w-16px mr-2 d-block" src="${icon__clock}" alt="" />
        </div>
        <div>
          <p class="mb-0 mt-0 fs-18 ff-sued fw-400">${t.hours[lang]}</p>
        </div>
      </div>
      <div class="col-12">
        <p class="color-black-400 mt-2 fw-300 mb-3">
          ${text}
        </p>
      </div>
    </div>
  `;
};
