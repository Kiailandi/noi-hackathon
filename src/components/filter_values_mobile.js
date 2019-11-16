import { html } from 'lit-element';
import icon_x_orange from '../icons/orange/icon_x_orange.png';
import style from '../scss/filters_values_mobile.scss';
import { t } from '../translations';
import { getStyle, utils_capitalize } from '../utils';

export function render__filter_values_mobile() {
  const repaint_map = () => {
    this.map.removeLayer(this.layer_columns);
    this.map.removeLayer(this.layer_user);
    this.drawMap();
    this.is_loading = false;
  };

  const handle__radius = () => {
    this.shadowRoot.getElementById('input_filter_radius').value = 0;
    this.filters = {
      ...this.filters,
      radius: 0
    };
    repaint_map();
  };

  const handle__access_type = e => {
    const checkboxes = this.shadowRoot.querySelectorAll(`.filter_box input[value="${e}"]`);
    for (let i = 0; i < checkboxes.length; i++) {
      const element = checkboxes[i];
      element.checked = false;
    }
    this.filters = {
      ...this.filters,
      access_type: this.filters.access_type.filter(o => o !== e)
    };
    repaint_map();
  };

  const handle__plug_type = e => {
    const checkboxes = this.shadowRoot.querySelectorAll(`.filter_box input[value="${e}"]`);
    for (let i = 0; i < checkboxes.length; i++) {
      const element = checkboxes[i];
      element.checked = false;
    }
    this.filters = {
      ...this.filters,
      plug_type: this.filters.plug_type.filter(o => o !== e)
    };
    repaint_map();
  };

  return html`
    <style>
      ${getStyle(style)}
    </style>
    <div class="d-sm-none filter_values_mobile d-flex flex-nowrap">
      ${this.filters.access_type.map(
        o => html`
          <div
            class="filter_values_mobile__element d-inline-flex align-items-center mr-1"
            @click="${() => handle__access_type(o)}"
          >
            <div class="filter_values_mobile__element__text">
              <div class="pr-2 pl-2">
                <p class="fs-12 color-black-300">
                  ${t.type_of_access[this.language]}
                </p>
                <p class="fs-12">${utils_capitalize(o)}</p>
              </div>
            </div>
            <div class="filter_values_mobile__bkg_white_gradient">
              <img class="w-16px" src="${icon_x_orange}" alt="" />
            </div>
          </div>
        `
      )}
      ${this.filters.radius
        ? html`<div class="filter_values_mobile__element d-inline-flex align-items-center mr-1" @click="${() =>
            handle__radius()}">
        <div class="filter_values_mobile__element__text">
          <div class="pr-2 pl-2">
            <p class="fs-12 color-black-300">
              ${t.research_range[this.language]}
            </p>
            <p class="fs-12">${this.filters.radius}km</p>
          </div>
        </div>
        <div class="filter_values_mobile__bkg_white_gradient">
          <img class="w-16px" src="${icon_x_orange}" alt="" />
        </div>
      </div>
    </div>`
        : null}
      ${this.filters.plug_type.map(
        o => html`
          <div
            class="filter_values_mobile__element d-inline-flex align-items-center mr-1"
            @click="${() => handle__plug_type(o)}"
          >
            <div class="filter_values_mobile__element__text">
              <div class="pr-2 pl-2">
                <p class="fs-12 color-black-300">
                  ${t.plug_type[this.language]}
                </p>
                <p class="fs-12">${o}</p>
              </div>
            </div>
            <div class="filter_values_mobile__bkg_white_gradient">
              <img class="w-16px" src="${icon_x_orange}" alt="" />
            </div>
          </div>
        `
      )}
    </div>
  `;
}
