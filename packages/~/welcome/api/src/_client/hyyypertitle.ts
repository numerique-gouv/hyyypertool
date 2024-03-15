//

import { animate, fadeIn } from "@lit-labs/motion";
import config from "@~/app.core/config";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

//

@customElement("hyyyper-title")
export class Hyyyper_title extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    [hidden] {
      display: none;
    }
  `;

  //

  @property({ type: Boolean })
  is_yyy_done = false;

  //

  hyper = Array.from({ length: Math.max(3 + Math.random() * 5) }).fill("y");

  duration = 444;

  //

  on_all_animation_complete(is_last_element: boolean) {
    if (!is_last_element) return;
    this.is_yyy_done = true;
  }
  render() {
    return html` <!--  -->
      <link
        rel="stylesheet"
        href="${config.ASSETS_PATH}/node_modules/animate.css/source/_vars.css"
      />
      <link
        rel="stylesheet"
        href="${config.ASSETS_PATH}/node_modules/animate.css/source/_base.css"
      />
      <link
        rel="stylesheet"
        href="${config.ASSETS_PATH}/node_modules/animate.css/source/zooming_entrances/zoomInDown.css"
      />
      <link
        rel="stylesheet"
        href="${config.ASSETS_PATH}/node_modules/animate.css/source/attention_seekers/flash.css"
      />

      <!--  -->

      <link rel="stylesheet" href="${config.PUBLIC_ASSETS_PATH}/tailwind.css" />

      <!--  -->

      <div class="inline-flex">
        <span class="text-[--text-active-blue-france]">H</span>
        <span class="text-[--text-active-blue-france]"
          >${repeat(
            this.hyper,
            (i) => i,
            (item, i) =>
              html`<span
                ${animate({
                  keyframeOptions: {
                    duration: this.duration,
                    delay: (i * this.duration) / this.hyper.length,
                    fill: "both",
                  },
                  in: fadeIn,
                  onComplete: () =>
                    this.on_all_animation_complete(i + 1 === this.hyper.length),
                })}
                >${item}</span
              >`,
          )}</span
        >
        <span
          ?hidden=${!this.is_yyy_done}
          style="text-shadow: 0 0 4px #000;"
          class=" animated flash fast inline-block text-white"
        >
          per
        </span>
        <span
          class="animated slower delay-1s zoomInDown inline-block text-[--text-active-red-marianne]"
        >
          tool
        </span>
      </div>`;
  }
}
