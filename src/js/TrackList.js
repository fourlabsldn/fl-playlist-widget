import ViewController from './ViewController';
import assert from 'fl-assert';
import trackReorderDrag from './utils/trackReorderDrag';
import demoData from './utils/demoData';
import constants from './utils/constants';

export default class TrackList extends ViewController {
  constructor(modulePrefix) {
    super(modulePrefix);
    this.tracks = demoData;
    this.setTracks(this.tracks);
  }

  buildHtml() {
    super.buildHtml();
  }

  getTracks() {

  }


  /**
   * @public
   * @method setTracks
   * @param  {Array<Object>} tracks
   */
  setTracks(tracks) {
    this.html.container.innerHTML = '';
    assert(Array.isArray(tracks), `Invalid tracks object. Not an array: "${tracks}"`);
    tracks.forEach(track => {
      const trackEl = this.createTrackEl(track);
      this.setTrackListeners(trackEl);
      this.html.container.appendChild(trackEl);
    });
    this.tracks = tracks;
  }

  /**
   * @private
   * @method createTrackEl
   * @param  {Object} track
   * @return {HTMLElement}
   */
  createTrackEl(track) {
    const trackClass = `${this.cssPrefix}-track`;
    const trackEl = document.createElement('div');
    trackEl.classList.add(trackClass);

    const coverImg = document.createElement('img');
    coverImg.classList.add(`${trackClass}-cover`);
    coverImg.setAttribute('src', track.album.images[1].url);
    trackEl.appendChild(coverImg);

    const linearGradients = 'linear-gradient(rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0.94))';
    trackEl.style.background = `url("${track.album.images[1].url}"), ${linearGradients}`;

    const trackInfoClass = `${trackClass}-info`;
    const trackInfo = document.createElement('div');
    trackInfo.classList.add(trackInfoClass);
    trackEl.appendChild(trackInfo);

    const title = document.createElement('span');
    title.classList.add(`${trackInfoClass}-title`);
    title.innerHTML = track.name;
    trackInfo.appendChild(title);

    const artist = document.createElement('span');
    artist.classList.add(`${trackInfoClass}-artist`);
    artist.innerHTML = track.artists[0].name;
    trackInfo.appendChild(artist);

    if (track.explicit) {
      const explicit = document.createElement('span');
      explicit.classList.add(`${trackInfoClass}-explicit`);
      explicit.innerHTML = 'explicit';
      trackInfo.appendChild(explicit);
    }

    const buttonsBar = document.createElement('div');
    const buttonsBarClass = `${trackClass}-btns`;
    buttonsBar.classList.add(buttonsBarClass);
    trackEl.appendChild(buttonsBar);

    const dragBtn = document.createElement('button');
    dragBtn.innerHTML = constants.dragIcon;
    dragBtn.setAttribute('draggable', 'true');
    dragBtn.classList.add(`${buttonsBarClass}-drag`);
    trackEl.dragBtn = dragBtn;
    buttonsBar.appendChild(dragBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add(`${buttonsBarClass}-delete`);
    this.deleteBtn = deleteBtn;
    deleteBtn.innerHTML = constants.trashIcon;
    buttonsBar.appendChild(deleteBtn);

    return trackEl;
  }

  /**
   * @private
   * Prepares a track element for insertion into the Wild
   * @param {HTMLElement} track
   * @method setTrackListeners
   */
  setTrackListeners(trackEl) {
    const draggingClass = `${this.cssPrefix}-track--dragging`

    trackEl.dragBtn.addEventListener('dragstart', (e) => {
      e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);
      trackEl.classList.add(draggingClass);
      const allTracks = Array.from(this.html.container.children);
      trackReorderDrag(e, trackEl, allTracks);
    });

    trackEl.dragBtn.addEventListener('dragend', () => {
      trackEl.classList.remove(draggingClass);
    });
  }
}
