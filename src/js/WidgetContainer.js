import ViewController from './ViewController';
import assert from 'fl-assert';

export default class WidgetContainer extends ViewController {

  constructor(modulePrefix) {
    super(modulePrefix);
    this.infoTimeout = null;
    Object.preventExtensions(this);
  }

  buildHtml() {
    super.buildHtml();
    const info = document.createElement('span');
    this.html.info = info;
    info.classList.add(`${this.cssPrefix}-info`);
    this.html.container.appendChild(info);

    const loadingIndicator = document.createElement('span');
    this.html.loadingIndicator = loadingIndicator;
    loadingIndicator.classList.add(`${this.cssPrefix}-loadingIndicator`);
    this.html.container.appendChild(loadingIndicator);

    const submissionBox = document.createElement('span');
    this.html.submissionBox = submissionBox;
    this.html.container.appendChild(submissionBox);

    const tracksContainer = document.createElement('div');
    this.html.tracksContainer = tracksContainer;
    tracksContainer.classList.add(`${this.cssPrefix}-tracksContainer`);
    this.html.container.appendChild(tracksContainer);

    const trackList = document.createElement('div');
    this.html.trackList = trackList;
    trackList.classList.add(`${this.cssPrefix}-trackList`);
    tracksContainer.appendChild(trackList);

    const searchResults = document.createElement('div');
    this.html.searchResults = searchResults;
    searchResults.classList.add(`${this.cssPrefix}-searchResults`);
    tracksContainer.appendChild(searchResults);
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
   * @method displayInfo
   * @param  {String} message
   * @param  {Int} duration
   * @return {void}
   */
  displayInfo(message, error = false, duration = 2000) {
    const errorClass = `${this.cssPrefix}-info--error`;
    const successClass = `${this.cssPrefix}-info--success`;
    this.html.info.classList.remove(errorClass, successClass);
    this.html.info.innerHTML = message;
    if (error) {
      this.html.info.classList.add(errorClass);
    } else {
      this.html.info.classList.add(successClass);
    }
    this.errorTimeout = setTimeout(
      () => {
        this.html.info.classList.remove(errorClass, successClass);
        this.html.info.innerHTML = '';
      },
      duration
    );
  }
}
