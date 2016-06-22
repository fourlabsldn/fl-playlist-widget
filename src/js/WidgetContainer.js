import ViewController from './ViewController';
import assert from 'fl-assert';

export default class WidgetContainer extends ViewController {

  constructor(modulePrefix) {
    super(modulePrefix);
    this.errorTimeout = null;
    Object.preventExtensions(this);
  }

  buildHtml() {
    super.buildHtml();
    const errorContainer = document.createElement('span');
    this.html.errorContainer = errorContainer;
    errorContainer.classList.add(`${this.cssPrefix}-errorContainer`);
    this.html.container.appendChild(errorContainer);

    const loadingIndicator = document.createElement('span');
    this.html.loadingIndicator = loadingIndicator;
    loadingIndicator.classList.add(`${this.cssPrefix}-loadingIndicator`);
    this.html.container.appendChild(loadingIndicator);

    const submissionBox = document.createElement('span');
    this.html.submissionBox = submissionBox;
    this.html.container.appendChild(submissionBox);

    const resultsBox = document.createElement('div');
    this.html.resultsBox = resultsBox;
    resultsBox.classList.add(`${this.cssPrefix}-resultsBox`);
    this.html.container.appendChild(resultsBox);
  }

  /**
   * Sets a ViewController instance as one of the container's elements.
   * @public
   * @method set
   * @param  {String} name
   * @param  {ViewController} instance
   */
  set(name, instance) {
    assert(this.html[name], `Trying to set invalid property: ${name}`);
    this.html[name].parentNode.replaceChild(instance.html.container, this.html[name]);
    this.html[name] = instance.html.container;
  }

  /**
   * Displays a message for a certain period of time
   * @method displayError
   * @param  {String} message
   * @return {void}
   */
  displayError(message) {
    this.html.errorContainer.innerHTML = message;
    this.errorTimeout = setTimeout(
      () => { this.html.errorContainer.innerHTML = ''; },
      2000
    );
  }
}
