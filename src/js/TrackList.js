import ViewController from './ViewController';
import assert from 'fl-assert';
import demoData from './demoData';

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

  setTracks(tracks) {
    this.html.container.innerHTML = '';
    assert(Array.isArray(tracks), `Invalid tracks object. Not an array: "${tracks}"`);
    tracks.forEach(track => {
      const trackEl = this.createTrackEl(track);
      this.html.container.appendChild(trackEl);
    });
    this.tracks = tracks;
  }

  /**
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

    return trackEl;
  }
}
