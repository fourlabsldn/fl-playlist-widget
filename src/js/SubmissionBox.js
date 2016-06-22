import ViewController from './ViewController';
import assert from 'fl-assert';

export default class SubmissionBox extends ViewController {
  constructor(modulePrefix) {
    super(modulePrefix);
    this.acceptEvents('submit');
  }

  buildHtml() {
    super.buildHtml();
    const textInput = document.createElement('input');
    this.html.textInput = textInput;
    textInput.setAttribute('type', 'text');
    textInput.classList.add(`${this.cssPrefix}-textInput`, 'form-control');
    this.html.container.appendChild(textInput);

    const submitBtn = document.createElement('button');
    this.html.submitBtn = submitBtn;
    submitBtn.innerHTML = 'Add';
    submitBtn.classList.add(`${this.cssPrefix}-submitBtn`, 'btn', 'btn-default');
    this.html.container.appendChild(submitBtn);
    submitBtn.addEventListener('click', () => {
      this.trigger('submit');
    });
  }

  /**
   * @public
   * @method getInput
   * @return {String}
   */
  getInput() {
    return this.html.textInput.value;
  }

  /**
   * @public
   * @method setInput
   * @param  {String} text
   */
  setInput(text) {
    assert(typeof text === 'string',  `Invalid value for inputText: ${text}`);
    this.html.textInput.value = text;
  }
}
