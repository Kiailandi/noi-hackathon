import { html } from 'lit-html';

export function render__search_box_underlay() {
  return html`
    ${this.searched_places.length
      ? html`
          <div
            @click=${() => {
              this.searched_places = [];
              this.query_nominatim = '';
            }}
            class="search_box__resoult_list__underlay"
          ></div>
        `
      : null}
    ${!this.searched_places.length && this.query_nominatim.length
      ? html`
          <div
            @click=${() => {
              this.query_nominatim = '';
            }}
            class="search_box__resoult_list__underlay"
          ></div>
        `
      : null}
  `;
}
