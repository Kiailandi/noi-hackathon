import { html } from 'lit-element';
import style from '../scss/search_box.scss';
import icon_filter from '../icons/grey/icon_filter_normal_grey.png';
import icon_search from '../icons/grey/icon_search_grey.png';
import { debounce, getStyle } from '../utils';
import icon_center from '../icons/blue/icon_localization_blue.png';
import icon_pin from '../icons/grey/icon_map_pin_grey.png';
import icon_x_grey from '../icons/grey/icon_x_grey.png';
import { t } from '../translations';
import icon__close from '../icons/close@2x.png';

export function render__search_box() {
  const debounced_request = debounce(500, this.request__get_coordinates_from_search);

  const handle_onchange = e => {
    this.query_nominatim = e.target.value;
    if (e.target.value) {
      debounced_request(e.target.value);
      this.showFilters = false;
      this.current_station = {};
    } else {
      this.searched_places = [];
    }
  };

  const manage_map = (lat, lng) => {
    this.current_location = { lat: parseFloat(lat), lng: parseFloat(lng) };
    this.current_station = {};
    this.searched_places = [];
    this.showFilters = false;
    this.map.flyTo([lat, lng], 15);
    this.map.removeLayer(this.layer_columns);
    this.map.removeLayer(this.layer_user);
    this.drawMap();
    this.is_loading = false;
  };

  const handle__move_to_current_position = () => {
    try {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'granted') {
          this.is_loading = true;
          navigator.geolocation.getCurrentPosition(
            pos => {
              const { latitude, longitude } = pos.coords;
              manage_map(latitude, longitude);
            },
            () => {}
          );
        } else {
          this.is_loading = false;
        }
      });
    } catch (error) {
      this.is_loading = false;
    }
  };

  const handle__move_to_place = (lat, lng) => {
    this.is_loading = true;
    this.searched_places = [];
    this.query_nominatim = '';
    manage_map(lat, lng);
  };

  const render__places_list = () => {
    return html`
      <div class="position-absolute search_box__container__resoult_list">
        <div class="bkg-white">
          <ul>
            <li @click="${handle__move_to_current_position}" class="p-3 d-flex align-items-center">
              <img class="w-14px mr-2" src="${icon_center}" alt="" /> ${t.my_position[this.language]}
            </li>
            ${this.searched_places.map(o => {
              return html`
                <li
                  @click="${() => handle__move_to_place(o.lat, o.lon)}"
                  class="pt-2 pb-2 pl-3 pr-3 d-flex align-items-center"
                >
                  <img class="w-16px mr-2" src="${icon_pin}" alt="" /> ${o.display_name}
                </li>
              `;
            })}
          </ul>
        </div>
      </div>
    `;
  };

  const handle_clear_input = () => {
    const input_box = this.shadowRoot.getElementById('id_search_box__input');
    input_box.value = '';
    this.query_nominatim = '';
    this.searched_places = [];
  };

  const handle_focus_input = () => {
    const input_box = this.shadowRoot.getElementById('id_search_box__input');
    this.query_nominatim = input_box.value;
    debounced_request(this.query_nominatim);
    if (this.query_nominatim.length) {
      this.showFilters = false;
      this.current_station = {};
    }
  };

  const { radius, access_type, plug_type, state, provider } = this.filters;
  return '';
  return html`
    <style>
      ${getStyle(style)}
    </style>
    <div class="d-flex align-items-center bkg-white position-relative search_box__container">
      <div>
        <img class="w-18px ml-2 mr-2" src="${icon_search}" alt="" />
      </div>
      <input
        @keyup="${handle_onchange}"
        class="search_box"
        name="place_query"
        type="text"
        id="id_search_box__input"
        placeholder="${t.search_on_greenmobility[this.language]}"
        @focus=${handle_focus_input}
      />
      ${this.query_nominatim.length
        ? html`
            <div @click=${handle_clear_input} class="search_box__clear_query">
              <img src="${icon__close}" alt="" />
            </div>
          `
        : null}
      <div>
        <div style="height: 24px; width: 1px; background-color: rgba(136, 137, 139, 0.24);"></div>
      </div>
      <div @click="${() => this.handleToggleShowFilters()}" class="utils--cursor-pointer">
        ${(radius > 0 ||
          access_type.length ||
          plug_type.length ||
          plug_type.length ||
          state.length ||
          provider.length) &&
        !this.showFilters
          ? html`
              <div class="search_box__filter_badge"></div>
            `
          : null}
        <img class="w-18px ml-3 mr-3" src="${this.showFilters ? icon_x_grey : icon_filter}" alt="" />
      </div>
      ${this.searched_places.length ? render__places_list() : null}
      ${!this.searched_places.length && this.query_nominatim.length
        ? html`
            <div class="position-absolute search_box__container__resoult_list">
              <div class="bkg-white">
                <div class="search_box__empty_set">
                  <p>
                    ${t.empty_set__nominatim_locations[this.language]}
                  </p>
                </div>
              </div>
            </div>
          `
        : null}
    </div>
  `;
}
