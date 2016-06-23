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

    const icon = document.createElement('div');
    this.html.icon = icon;
    icon.innerHTML = constants.soundNoteIcon;
    icon.classList.add(`${this.cssPrefix}-icon`, 'btn', 'btn-default');
    this.html.container.appendChild(icon);

    const textInput = document.createElement('input');
    this.html.textInput = textInput;
    textInput.setAttribute('type', 'text');
    textInput.classList.add(`${this.cssPrefix}-textInput`, 'form-control');
    this.html.container.appendChild(textInput);
    textInput.addEventListener('keydown', (e) => {
      const enterKeyCode = 13;
      const keyPressedCode = e.keyCode ? e.keyCode : e.which;
      if (keyPressedCode === enterKeyCode) {
        this.trigger('enterPressed');
      } else {
        this.trigger('usertyping', keyPressedCode);
      }
    });
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
