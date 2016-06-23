import ViewController from './ViewController';
import assert from 'fl-assert';
import onClickOut from './utils/onClickOut';

export default class SearchResults extends ViewController {

  constructor(modulePrefix) {
    super(modulePrefix);
    Object.preventExtensions(this);

    this.acceptEvents('resultClick');
    this.on('resultClick', () => this.setVisible(false));
    this.handleKeyboardNavigation();
  }

  /**
   * @public
   * @method setResults
   * @param  {[type]} resultsInfo [description]
   */
  setResults(resultsInfo) {
    assert(Array.isArray(resultsInfo), `Results is not an array: ${resultsInfo}`);
    this.clearResults();
    this.setVisible(true);

    if (resultsInfo.length === 0) {
      this.addResult({ text: 'No results found.' });
    } else {
      resultsInfo.forEach(info => this.addResult(info));
    }
  }

  /**
   * @private
   * @method addResult
   * @param  {[type]} info [description]
   */
  addResult(info) {
    const result = document.createElement('button');
    result.classList.add(`${this.cssPrefix}-result`);

    if (info.album && info.album.images && info.album.images[1]) {
      const cover = document.createElement('img');
      cover.setAttribute('src', info.album.images[1].url);
      cover.classList.add(`${this.cssPrefix}-cover`);
      result.appendChild(cover);
    }

    if (info.name) {
      const title = document.createElement('span');
      title.classList.add(`${this.cssPrefix}-title`);
      title.innerHTML = info.name;
      result.appendChild(title);
    }

    if (Array.isArray(info.artists)) {
      const artist = document.createElement('span');
      artist.classList.add(`${this.cssPrefix}-artist`);
      artist.innerHTML = info.artists[0] ? info.artists[0].name : 'Unknown artist';
      result.appendChild(artist);
    }

    if (info.text) {
      const text = document.createElement('span');
      text.classList.add(`${this.cssPrefix}-text`);
      text.innerHTML = info.text;
      result.appendChild(text);
    }

    if (info.id) {
      result.addEventListener('click', () => this.trigger('resultClick', info.id));
    }
    this.html.container.appendChild(result);
  }

  /**
   * @private
   * @method setVisible
   * @param  {Boolean} visible
   */
  setVisible(visible) {
    const visibilityClass = `${this.cssPrefix}--visible`;
    if (visible) {
      this.html.container.classList.add(visibilityClass);
      onClickOut(this.html.container, () => this.setVisible(false));
    } else {
      this.html.container.classList.remove(visibilityClass);
    }
  }


  /**
   * @private
   * @method clearResults
   * @return {void}
   */
  clearResults() {
    this.html.container.innerHTML = '';
  }

  handleKeyboardNavigation(container = this.html.container) {
    container.addEventListener('keydown', (e) => {
      e.preventDefault();
      // Only navigate if there are enough elements
      if (this.getContainer().children.length < 2) { return; }
      const arrowDownCode = 40;
      const arrowUpCode = 38;

      const activeElement = document.activeElement;
      assert(activeElement, 'No active element found');
      if (activeElement.nextSibling && e.keyCode === arrowDownCode) {
        activeElement.nextSibling.focus();
      } else if (activeElement.previousSibling && e.keyCode === arrowUpCode) {
        activeElement.previousSibling.focus();
      } else {
        this.startKeyboardNavigation();
      }
    });
  }

  /**
   * Focuses on the first element to start the keyboard navigation.
   * @public
   * @method startKeyboardNavigation
   * @return {[type]} [description]
   */
  startKeyboardNavigation() {
    const firstElement = this.getContainer().children[0];
    if (firstElement) { firstElement.focus(); }
  }
}
