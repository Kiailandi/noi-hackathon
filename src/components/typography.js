import { html } from 'lit-element';

export function render__h1(text, icon) {
  return html`
    <div class="col-12 d-flex align-items-center">
      <div>
        <img class="w-32px mr-2" src="${icon}" alt="" />
      </div>
      <div>
        <h1 class="mb-0 mt-0 fs-24 ff-sued">${text}</h1>
      </div>
    </div>
  `;
}
