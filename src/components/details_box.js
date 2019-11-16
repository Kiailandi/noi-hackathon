import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import L from 'leaflet';
import icon__card from '../icons/card.png';
import icon__close from '../icons/close@2x.png';
import icon__green_dot from '../icons/green/green_dot.png';
import icon_hotel_green from '../icons/green/icon_hotel_green.png';
import icon_restaurant_green from '../icons/green/icon_restaurant_green.png';
import icon_carsharing_green from '../icons/green/carsharing-green.png';
import icon_bikesharing_green from '../icons/green/bikesharing-green.png';
import icon__info from '../icons/info.png';
import icon__pin from '../icons/pin.png';
import icon__red_dot from '../icons/red_dot.png';
import icon__type_1 from '../icons/type_1.png';
// import icon__feedback_black from '../icons/black/icon_feedback_black.png';
// import icon__star_void_grey from '../icons/grey/icon_star_void_grey.png';
import style from '../scss/details_box.scss';
import { t } from '../translations';
import { encodeXml, getStyle, stationStatusMapper, utils_truncate } from '../utils';
import { initialize_swipe } from '../utils/swipe_box';
import { render__hours_section } from './details_box/hours_section';
import { render__rating_section } from './details_box/rating_section';
import { render__state_label } from './state_label';
import { render__h1 } from './typography';
import icon__up from '../icons/up.svg';
import icon__down from '../icons/down.svg';

export function render__details_box() {
  const { state, accessType, name, plugs_status, paymentInfo, latitude, longitude, accessInfo } = this.current_station;
  const { origin } = this.current_station;

  const user_actions_container__details = this.shadowRoot.getElementById('user_actions_container__details');
  const details_box__expand_handle__details = this.shadowRoot.getElementById('details_box__expand_handle__details');

  if (user_actions_container__details && details_box__expand_handle__details) {
    const binded_initialize_swipe = initialize_swipe.bind(this);
    binded_initialize_swipe(details_box__expand_handle__details, user_actions_container__details);
  }

  this.render__rating_section = render__rating_section.bind(this);

  return html`
      <style>
        ${getStyle(style)}
      </style>
      <div class="details_box">
        <div id="details_box__expand_handle__details" class="details_box__expand_handle pt-2 pb-2 d-sm-none">
          ${this.details_mobile_state ? unsafeHTML(icon__down) : unsafeHTML(icon__up)}
        </div>
        <div class="details_box__header">
          ${render__state_label(state, this.language)} ${render__state_label(accessType, this.language)}
          <div
            class="details_box__close_button"
            @click="${() => {
              user_actions_container__details.classList.remove('open');
              this.current_station = {};
            }}"
          >
            <img src="${icon__close}" alt="" />
          </div>
        </div>
        <div class="details_box__body">
          <!-- Detail box -->
          <div class="details_box__section mt-3">
            ${render__h1(name, stationStatusMapper(state, origin))}
            <div class="col-12">
              <p class="color-black-300 mt-2 fw-300">${this.current_station.address}</p>
              <p class="color-black-300 fw-300">${this.current_station.municipality}</p>
              ${this.render__rating_section()}
              <a
                href="${`https://www.google.com/maps/dir/${this.station_location.lat},${this.station_location.lng}/${this.current_location.lat},${this.current_location.lng}`}"
                target="_blank"
                class="color-green fs-16 fw-300 mt-2 mb-3 d-block"
              >
                ${t.directions[this.language]} →
              </a>
            </div>
          </div>
          <!-- Detail box -->
          ${render__hours_section(accessInfo, this.language)}
          <!-- Detail box -->
          <!-- TODO ADD colonnine <div class="details_box__section mt-3 pb-3">
            <div class="col-12 d-flex align-items-center">
              <div>
                <p class="mb-0 mt-0 fs-18 ff-sued fw-400">
                  ${t.available_columns[this.language]}
                </p>
              </div>
            </div>
            <div class="col-12">
              ${
                this.current_station.station_plugs
                  ? this.current_station.station_plugs.map((o, i) => {
                      const status = plugs_status[i];
                      return html`
                        <div class="element_background d-flex align-items-center pt-2 pb-2 mt-3">
                          <div class="ml-3 mr-3 position-relative">
                            <img
                              class="w-18px d-block position-absolute"
                              style="top: -6px;right: -6px;"
                              src="${status.value ? icon__green_dot : icon__red_dot}"
                            />
                            <img class="w-24px d-block" src="${icon__type_1}" alt="" />
                          </div>
                          <div>
                            <!-- <p class="color-blue fs-12 bkg-blue pt-1 pb-1 pl-2 pr-2  border-r-4px d-inline-block">
                        FAST CHARGE <b>falso</b>
                      </p> -->
                            <p class="fs-16 mt-1">${t.type_sockets[this.language]}:</p>
                            ${o.outlets.map(
                              outlet =>
                                html`
                                  <div class="d-flex">
                                    <p class="fs-14 mt-1 mr-2">-</p>
                                    <p class="fs-14 mt-1">
                                      ${outlet.outletTypeCode} - ${outlet.maxPower || '--'} kW/h <br />
                                      <span class="fs-12 color-black-400 mt-2 fw-300">
                                        ${t.column[this.language]} ${i + 1} ∙
                                        ${Object.prototype.hasOwnProperty.call(outlet, 'minCurrent')
                                          ? outlet.minCurrent
                                          : '*'}
                                        - ${outlet.maxCurrent || '*'} A
                                      </span>
                                    </p>
                                  </div>
                                `
                            )}
                          </div>
                          <!-- <div class="text-center flex-fill mr-2 ml-2">
                            <img class="w-24px d-table mr-auto ml-auto" src="${icon__info}" alt="" />
                          </div> -->
                        </div>
                      `;
                    })
                  : null
              }
            </div>
            </div>-->
            <!-- Detail box -->
            <!-- TODO ADD PAYMENT <div class="details_box__section mt-3 pb-3">
              <div class="col-12 d-flex align-items-center">
                <div>
                  <img class="w-16px mr-2 d-block" src="${icon__card}" alt="" />
                </div>
                <div>
                  <p class="mb-0 mt-0 fs-18 ff-sued fw-400">${t.payment[this.language]}</p>
                </div>
              </div>
              <div class="col-12 d-none">
                <p class="color-black-400 mt-2 fw-300 fs-16">
                  Il pagamento può essere effettuato tramite la Card Route220 o tramite tutte le carte compatibili
                  EVWay. FAKE
                </p>
              </div>
             <div class="col-12">
                <a
                  href="${paymentInfo}"
                  class="color-green fs-16 fw-300 mt-2 mb-3 color-green--hover d-block"
                  target="_blank"
                >
                  ${t.more_informations[this.language]} →
                </a>
              </div>
            </div>-->
            <!-- Detail box -->
            <div class="details_box__section mt-3">
              ${
                this.station_near_restaurants.length || this.station_near_accomodations.length
                  ? html`
                      <div class="col-12 d-flex align-items-center">
                        <div>
                          <img class="w-16px mr-2 d-block" src="${icon__pin}" alt="" />
                        </div>
                        <div>
                          <p class="mb-0 mt-0 fs-18 ff-sued fw-400">${t.near_places[this.language]}</p>
                        </div>
                      </div>
                    `
                  : null
              }
              <div class="col-12">
                ${this.station_near_restaurants.map(o => {
                  return html`
                    <div class="element_background d-flex pt-2 pb-2 mt-3">
                      <div class="ml-3 mr-3 position-relative mt-2">
                        <img class="w-24px d-block" src="${icon_restaurant_green}" alt="" />
                      </div>
                      <div class="flex-fill">
                        <p class="fs-16 mt-1">${o.Detail[this.language] ? o.Detail[this.language].Title : '---'}</p>
                        <p class="fs-12 color-black-400 mt-1 pr-2">
                          ${o.Detail[this.language]
                            ? utils_truncate(encodeXml(o.Detail[this.language].BaseText), 40)
                            : 'No description'}
                        </p>
                        <a
                          href="${`https://www.suedtirol.info/${this.language}/tripmapping/activity/${o.Id.replace(
                            'GASTRO',
                            'SMGPOI'
                          )}`}"
                          class="color-green color-green--hover fs-16 fw-300 mt-2 mb-2 d-block"
                          target="_blank"
                          >${t.more_informations[this.language]} →</a
                        >
                      </div>
                    </div>
                  `;
                })}
                ${this.station_near_accomodations.map(o => {
                  return html`
                    <div class="element_background d-flex pt-2 pb-2 mt-3">
                      <div class="ml-3 mr-3 position-relative mt-2">
                        <img class="w-24px d-block" src="${icon_hotel_green}" alt="" />
                      </div>
                      <div class="flex-fill">
                        <p class="fs-16 mt-1">
                          ${o.AccoDetail[this.language] ? o.AccoDetail[this.language].Name : '---'}
                        </p>
                        <a
                          href="${`https://www.suedtirol.info/${this.language}/tripmapping/acco/${o.Id}`}"
                          class="color-green color-green--hover fs-16 fw-300 mt-2 mb-2 d-block"
                          target="_blank"
                          >${t.more_informations[this.language]} →</a
                        >
                      </div>
                    </div>
                  `;
                })}
                ${this.station_near_carsharing
                  .sort(
                    (a, b) =>
                      L.latLng([a.scoordinate.y, a.scoordinate.x]).distanceTo([
                        this.station_location.lat,
                        this.station_location.lng
                      ]) -
                      L.latLng([b.scoordinate.y, b.scoordinate.x]).distanceTo([
                        this.station_location.lat,
                        this.station_location.lng
                      ])
                  )
                  .map(o => {
                    console.log('near carsharing', o);
                    return html`
                      <div class="element_background d-flex pt-2 pb-2 mt-3">
                        <div
                          class="ml-3 mr-3 position-relative mt-2 button"
                          style="cursor: pointer;"
                          @click="${() => {
                            this.map.flyTo([o.scoordinate.y, o.scoordinate.x], 15);
                          }}"
                        >
                          <img class="w-24px d-block" src="${icon_carsharing_green}" alt="" />
                        </div>
                        <div class="flex-fill">
                          <p class="fs-16 mt-1">
                            ${o.sname}
                          </p>
                        </div>
                      </div>
                    `;
                  })}
                ${this.station_near_bikesharing
                  .sort(
                    (a, b) =>
                      L.latLng([a.scoordinate.y, a.scoordinate.x]).distanceTo([
                        this.station_location.lat,
                        this.station_location.lng
                      ]) -
                      L.latLng([b.scoordinate.y, b.scoordinate.x]).distanceTo([
                        this.station_location.lat,
                        this.station_location.lng
                      ])
                  )
                  .map(o => {
                    console.log('near bikesharing', o);
                    return html`
                      <div class="element_background d-flex pt-2 pb-2 mt-3">
                        <div
                          class="ml-3 mr-3 position-relative mt-2 button"
                          style="cursor: pointer;"
                          @click="${() => {
                            this.map.flyTo([o.scoordinate.y, o.scoordinate.x], 15);
                          }}"
                        >
                          <img class="w-24px d-block" src="${icon_bikesharing_green}" alt="" />
                        </div>
                        <div class="flex-fill">
                          <p class="fs-16 mt-1">
                            ${o.sname}
                          </p>
                        </div>
                      </div>
                    `;
                  })}
              </div>
            </div>
            <!-- End -->
          </div>
        </div>
      </div>
    `;
}
