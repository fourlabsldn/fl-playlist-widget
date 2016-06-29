import ViewController from './ViewController';
import assert from 'fl-assert';
import constants from './utils/constants';

export default class SearchBox extends ViewController {
  constructor(modulePrefix) {
    super(modulePrefix);
    this.highlightTimeout = null;
    this.acceptEvents('enterPressed', 'usertyping');
  }

  buildHtml() {
    super.buildHtml();

    const range = document.createRange();
    range.selectNode(document.body);

    const searchBoxFragment = range.createContextualFragment(`
      <div class="input-group">
          <span class="input-group-addon">
            <svg width="14" height="14" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" class="${this.cssPrefix}-icon">
              <path d="M1216 832q0-185-131.5-316.5t-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5 316.5-131.5 131.5-316.5zm512 832q0 52-38 90t-90 38q-54 0-90-38l-343-342q-179 124-399 124-143 0-273.5-55.5t-225-150-150-225-55.5-273.5 55.5-273.5 150-225 225-150 273.5-55.5 273.5 55.5 225 150 150 225 55.5 273.5q0 220-124 399l343 343q37 37 37 90z"/>
            </svg>
          </span>
          <input type="text" placeholder="Search Spotify..." class="form-control ${this.cssPrefix}-textInput">
      </div>
    `);

    this.html.textInput = searchBoxFragment.querySelector('input');

    this.html.textInput.addEventListener('keydown', (e) => {
      const enterKeyCode = 13;
      const keyPressedCode = e.keyCode ? e.keyCode : e.which;
      if (keyPressedCode === enterKeyCode) {
        this.trigger('enterPressed');
      } else {
        this.trigger('usertyping', keyPressedCode);
      }
    });

    this.html.container.appendChild(searchBoxFragment);
  }

  /**
   * @public
   * @method getInput
   * @return {String}
   */
  getInput() {
    return this.html.textInput.value.trim();
  }

  /**
   * @public
   * @method setInput
   * @param  {String} text
   */
  setInput(text) {
    assert(typeof text === 'string', `Invalid value for inputText: ${text}`);
    this.html.textInput.value = text;
  }


  /**
   * Highlights the submission box for success or failure
   * @method showOutcomeSuccess
   * @param  {Boolean} noError
   * @param  {Int} duration
   * @return {void}
   */
  showOutcomeSuccess(noError = true, duration = 2000) {
    const successClass = 'has-success';
    const errorClass = 'has-error';

    if (noError) {
      this.html.container.classList.add(successClass);
    } else {
      this.html.container.classList.add(errorClass);
    }
    clearTimeout(this.highlightTimeout);
    this.highlightTimeout = setTimeout(
      () => this.html.container.classList.remove(successClass, errorClass),
      duration
    );
  }
}
