import ViewController from './ViewController';
import assert from 'fl-assert';
import onClickOut from './utils/onClickOut';

export default class SearchResults extends ViewController {

  constructor(modulePrefix) {
    super(modulePrefix);
    Object.preventExtensions(this);

    this.acceptEvents('resultClick');
    this.on('resultClick', () => this.setVisible(false));
  }

  /**
   * @public
   * @method setResults
   * @param  {[type]} resultsInfo [description]
   */
  setResults(resultsInfo) {
    assert(Array.isArray(resultsInfo), `Results is not an array: ${resultsInfo}`);
    this.clearResults();
    if (resultsInfo.length === 0) {
      this.html.container.innerHTML = 'No results found.';
      return;
    }
    resultsInfo.forEach(info => this.addResult(info));
    this.setVisible(true);
  }

  /**
   * @private
   * @method addResult
   * @param  {[type]} info [description]
   */
  addResult(info) {
    const result = document.createElement('div');
    result.classList.add(`${this.cssPrefix}-result`);

    const cover = document.createElement('img');
    cover.setAttribute('src', info.album.images[1].url);
    cover.classList.add(`${this.cssPrefix}-cover`);
    result.appendChild(cover);

    const title = document.createElement('span');
    title.classList.add(`${this.cssPrefix}-title`);
    title.innerHTML = info.name;
    result.appendChild(title);

    const artist = document.createElement('span');
    artist.classList.add(`${this.cssPrefix}-artist`);
    artist.innerHTML = info.artists[0] ? info.artists[0].name : 'Unknown artist';
    result.appendChild(artist);

    result.addEventListener('click', () => this.trigger('resultClick', info.id));
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
}
