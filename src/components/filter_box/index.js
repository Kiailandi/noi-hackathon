import { html } from 'lit-element';
import icon__green_marker from '../../icons/green/green@2x.png';
import style from '../../scss/details_box.scss';
import { t } from '../../translations';
import { getStyle, utils_capitalize } from '../../utils';
// import { plug_types } from './api';

export function render__filter_box() {
  const repaint_map = async () => {
    this.map.removeLayer(this.layer_columns);
    this.map.removeLayer(this.layer_user);
    await this.drawMap();
    this.showFilters = false;
    this.is_loading = false;
  };

  const handle__radius = e => {
    this.filters = {
      ...this.filters,
      radius: parseInt(e.target.value, 10)
    };
  };

  const handle__access_type = e => {
    if (e.target.checked) {
      this.filters = {
        ...this.filters,
        access_type: [...this.filters.access_type, e.target.value]
      };
    } else {
      this.filters = {
        ...this.filters,
        access_type: this.filters.access_type.filter(o => o !== e.target.value)
      };
    }
  };

  const handle__plug_type = e => {
    if (e.target.checked) {
      this.filters = {
        ...this.filters,
        plug_type: [...this.filters.plug_type, e.target.value]
      };
    } else {
      this.filters = {
        ...this.filters,
        plug_type: this.filters.plug_type.filter(o => o !== e.target.value)
      };
    }
  };

  const handle__provider = e => {
    if (e.target.checked) {
      this.filters = {
        ...this.filters,
        provider: [...this.filters.provider, e.target.value]
      };
    } else {
      this.filters = {
        ...this.filters,
        provider: this.filters.provider.filter(o => o !== e.target.value)
      };
    }
  };

  const handle__state = e => {
    if (e.target.checked) {
      this.filters = {
        ...this.filters,
        state: [...this.filters.state, e.target.id]
      };
    } else {
      this.filters = {
        ...this.filters,
        state: this.filters.state.filter(o => o !== e.target.id)
      };
    }
  };

  const handle__reset_filters = () => {
    this.filters = {
      ...this.filters,
      radius: 0,
      access_type: [],
      plug_type: [],
      provider: []
    };
    const all_checkbox = this.shadowRoot.querySelectorAll('.filter_box input[type="checkbox"]');
    for (let i = 0; i < all_checkbox.length; i++) {
      const element = all_checkbox[i];
      element.checked = false;
    }
    this.shadowRoot.getElementById('input_filter_radius').value = '0';
    repaint_map();
  };

  // const access_types = await request_access_types();

  return html`
    <style>
      ${getStyle(style)}
    </style>
    <div class="details_box filter_box">
      <div class="filter_box__body">
        <!-- Detail box -->
        <div class="details_box__section mt-3">
          <div class="col-12 d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <p class="fs-16">${t.search_filters[this.language]}</p>
            </div>
            <div class="col-auto col-sm-12 p-0 d-flex align-items-center mt-lg-2">
              <div>
                <img class="w-24px mr-1 d-none d-lg-block" src="${icon__green_marker}" alt="" />
              </div>
              <p class="fs-14 color-black-400">
                ${this.visibleStations} ${t.available_columns[this.language].toLowerCase()}
              </p>
            </div>
          </div>
          <div class="col-12 p-0 mt-2 d-none d-lg-block">
            <div style="border-bottom: 2px solid #f0f1f1;"></div>
          </div>
          <div class="col-12 mt-3 mb-3">
            <p class="fs-14 color-black-400">${t.research_range[this.language]}</p>
            <select @change="${e => handle__radius(e)}" name="" id="input_filter_radius" class="mt-2" style="">
              <option value="0">${t.no_one[this.language]}</option>
              <option value="5">5km</option>
              <option value="10">10km</option>
              <option value="15">15km</option>
            </select>
          </div>
        </div>
        <!-- Detail box -->
        <div class="details_box__section mt-3">
          <div class="col-12">
            <p class="fs-14">${t.type_of_access[this.language]}</p>
            ${this.access_types.map((o, i) => {
              return html`
                <div class="custom-checkbox ${i === 0 ? 'mt-3' : ''}">
                  <label htmlFor="access-${o[0]}" class="fs-16">
                    <input
                      value="${o[1]}"
                      type="checkbox"
                      id="access-${o[0]}"
                      @change="${e => handle__access_type(e)}"
                    />
                    <span class="custom-checkbox-checkbox mr-2"></span>
                    ${utils_capitalize(o[2][this.language])}
                  </label>
                </div>
                ${i !== this.access_types.length - 1
                  ? html`
                      <hr />
                    `
                  : ''}
              `;
            })}
          </div>
        </div>
        <!-- Detail box -->
        <div class="details_box__section mt-3 d-none">
          <div class="col-12">
            <p class="fs-14">${t.column_state[this.language]}</p>
            <div class="custom-checkbox mt-3">
              <label htmlFor="state-1" class="fs-16">
                <input type="checkbox" id="state-1" @change="${e => handle__state(e)}" />
                <span class="custom-checkbox-checkbox mr-2"></span>
                ${t.completely_free[this.language]}
              </label>
            </div>
            <hr />
            <div class="custom-checkbox mt-2">
              <label htmlFor="state-2" class="fs-16">
                <input type="checkbox" id="state-2" @change="${e => handle__state(e)}" />
                <span class="custom-checkbox-checkbox mr-2"></span>
                ${t.at_least_one_free_column[this.language]}
              </label>
            </div>
          </div>
        </div>
        <!-- Detail box -->
        <div class="details_box__section mt-3">
          <div class="col-12">
            <p class="fs-14">${t.plug_type[this.language]}</p>
            <!-- "700 bar small vehicles" "UNKNOWN" -->

            ${this.plug_types.map((o, i) => {
              return html`
                <div class="custom-checkbox ${i === 0 ? 'mt-3' : ''}">
                  <label htmlFor="plug-1" class="fs-16">
                    <input type="checkbox" id="plug-${o[0]}" value="${o[1]}" @change="${e => handle__plug_type(e)}" />
                    <span class="custom-checkbox-checkbox mr-2"></span>
                    ${o[2]}
                  </label>
                </div>
                ${i !== this.plug_types.length - 1
                  ? html`
                      <hr />
                    `
                  : null}
              `;
            })}
          </div>
        </div>
        <!-- Detail box -->
        <div class="details_box__section mt-3 mb-3">
          <div class="col-12">
            <p class="fs-14 mb-3">${t.provider[this.language]}</p>
            ${this.provider_list.map((o, i) => {
              return html`
                <div class="custom-checkbox mt-2">
                  <label htmlFor=${`provider-${i + 1}`} class="fs-16">
                    <input type="checkbox" id=${`provider-${i + 1}`} value=${o} @change="${e => handle__provider(e)}" />
                    <span class="custom-checkbox-checkbox mr-2"></span>
                    ${o}
                  </label>
                </div>
                <hr />
              `;
            })}
          </div>
        </div>
      </div>
      <div class="filter_box__footer d-flex pr-3 pl-3">
        <button
          class="flex-fill filter_box_footer__button secondary mr-2"
          @click="${() => {
            this.showFilters = false;
            handle__reset_filters();
          }}"
        >
          ${t.cancel_filters[this.language]}
        </button>
        <button class="flex-fill filter_box_footer__button primary ml-2" @click="${() => repaint_map()}">
          ${t.apply_filters[this.language]}
        </button>
      </div>
    </div>
  `;
}
