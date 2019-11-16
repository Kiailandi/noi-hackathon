import { html } from 'lit-element';
import icon__star_void_grey from '../icons/grey/icon_star_void_grey.png';
import icon__x_grey from '../icons/grey/icon_x_grey.png';
import icon__star_full_orange from '../icons/orange/icon_star_full_orange.png';
import image__thanks_pin from '../icons/thanks_pin.png';
import image__mountain from '../icons/mountain.png';
import icon__imagefile_grey from '../icons/grey/icon_imagefile_grey.png';
import icon__x_orange from '../icons/orange/icon_x_orange.png';

export function render__modal__star_rating() {
  const handle_star_click = e => {
    const { target } = e;
    const star_list = this.shadowRoot.querySelectorAll('#star_rating_1 .star_rating__star');
    for (let i = 0; i < 5; i++) {
      star_list[i].src = icon__star_void_grey;
    }
    for (let i = 0; i < parseInt(target.dataset.number, 10) + 1; i++) {
      star_list[i].src = icon__star_full_orange;
    }
    this.user_vote = { ...this.user_vote, stars: parseInt(target.dataset.number, 10) + 1 };
  };

  const close_modal = () => {
    this.showRatingModal = false;
    this.ratingModalStep = 0;
  };

  const handle__send_feedback = () => {
    /**
     * TODO: send rating via API
     * fetch(...)
     */
    this.ratingModalStep = 1;
    setTimeout(() => {
      close_modal();
    }, 1500);
  };

  const handle__change_image = e => {
    this.user_vote = { ...this.user_vote, image: e.target.files[0], image_name: e.target.files[0].name };
  };
  const handle__change_comment = e => {
    this.user_vote = { ...this.user_vote, comment: e.target.value };
  };
  const handle__delete_image = () => {
    this.user_vote = { ...this.user_vote, image: '', image_name: '' };
  };

  return html`
    <div class="modal__star_ratings">
      <div class="modal_content">
        ${this.ratingModalStep === 0
          ? html`
              <div class="modal_header p-3 d-flex align-items-center justify-content-between">
                <p class="fs-30 fw-600">Inviaci il tuo feedback!</p>
                <div>
                  <img class="w-24px utils--cursor-pointer" src="${icon__x_grey}" @click="${() => close_modal()}" />
                </div>
              </div>
              <div class="modal_body p-3">
                <p class="fs-12">VALUTAZIONE COLONNINA</p>
                <div class="star_rating mt-2 d-inline-flex align-items-center" id="star_rating_1">
                  <div>
                    <img
                      class="w-32px utils--cursor-pointer star_rating__star"
                      src="${icon__star_void_grey}"
                      @click="${handle_star_click}"
                      data-number="0"
                    />
                  </div>
                  <div>
                    <img
                      class="w-32px utils--cursor-pointer star_rating__star"
                      src="${icon__star_void_grey}"
                      @click="${handle_star_click}"
                      data-number="1"
                    />
                  </div>
                  <div>
                    <img
                      class="w-32px utils--cursor-pointer star_rating__star"
                      src="${icon__star_void_grey}"
                      @click="${handle_star_click}"
                      data-number="2"
                    />
                  </div>
                  <div>
                    <img
                      class="w-32px utils--cursor-pointer star_rating__star"
                      src="${icon__star_void_grey}"
                      @click="${handle_star_click}"
                      data-number="3"
                    />
                  </div>
                  <div>
                    <img
                      class="w-32px utils--cursor-pointer star_rating__star"
                      src="${icon__star_void_grey}"
                      @click="${handle_star_click}"
                      data-number="4"
                    />
                  </div>
                  <p class="ml-2 fs-42 color-orange">${this.user_vote.stars}</p>
                </div>
                <p class="fs-12 mt-3">COMMENTO</p>
                <textarea id="" class="w-100 mt-2" rows="5" @keyup="${handle__change_comment}"></textarea>
                <div>
                  ${this.user_vote.image_name
                    ? html`
                        <div class="modal__star_ratings__image_to_upload d-flex align-items-center p-3 mt-3">
                          <div>
                            <img class="w-16px" src="${icon__imagefile_grey}" alt="" />
                          </div>
                          <div class="flex-fill">
                            <p class="ml-2">
                              ${this.user_vote.image_name}
                            </p>
                          </div>
                          <div>
                            <img
                              class="utils--cursor-pointer w-16px"
                              src="${icon__x_orange}"
                              @click="${handle__delete_image}"
                            />
                          </div>
                        </div>
                      `
                    : html`
                        <label for="select_file_input" class="btn-grey mt-2 pr-4 pl-4">
                          + Allega immagine
                        </label>
                      `}
                  <input style="display: none;" id="select_file_input" type="file" @change="${handle__change_image}" />
                </div>
              </div>
              <div class="modal_footer p-3 d-flex flex-row-reverse">
                <button
                  class="filter_box_footer__button ${this.user_vote.stars ? 'primary' : 'secondary'} ml-2 pr-4 pl-4"
                  @click="${() => handle__send_feedback()}"
                >
                  Invia feedback
                </button>
                <button class="filter_box_footer__button secondary pr-4 pl-4" @click="${() => close_modal()}">
                  Annulla
                </button>
              </div>
            `
          : null}
        ${this.ratingModalStep === 1
          ? html`
              <div class="p-3">
                <div class="mt-5">
                  <img class="d-table mr-auto ml-auto w-160px" src="${image__thanks_pin}" alt="" />
                </div>
                <p class="fs-52 fw-600 text-center mt-4">
                  <span class="color-green">Grazie</span> per averci <br />
                  dato inviato il tuo feedback!
                </p>
                <img
                  class="display-table mr-auto ml-auto position-absolute w-100"
                  style="left: 0; bottom: 0;"
                  src="${image__mountain}"
                  alt=""
                />
              </div>
            `
          : null}
      </div>
    </div>
  `;
}
