import ViewController from './ViewController';
import Track from './Track';
import assert from 'fl-assert';
import trackReorderDrag from './utils/trackReorderDrag';
import removeIndex from './utils/removeIndex';

export default class TrackList extends ViewController {
  constructor(modulePrefix) {
    super(modulePrefix);
    this.tracks = [];
    this.setTracks(this.tracks);
    Object.preventExtensions(this);

    this.acceptEvents('change');
  }

  buildHtml() {
    super.buildHtml();
  }

  getTracks() {
    return this.tracks.slice();
  }

  /**
   * @public
   * @method setTracks
   * @param  {Array<Object>} tracks
   */
  setTracks(tracks) {
    assert(Array.isArray(tracks), `Invalid tracks object. Not an array: "${tracks}"`);
    this.clearAllTracks();
    tracks.forEach(trackInfo => this.addTrack(trackInfo));
  }

  /**
   * @private
   * @method clearAllTracks
   * @return {void}
   */
  clearAllTracks() {
    // TODO implement this
    this.tracks.forEach(t => t.destroy());
    this.tracks = [];
  }

  /**
   * @public
   * @method addTrack
   * @param  {Object} trackInfo
   * @return {Track}
   */
  addTrack(trackInfo) {
    const newTrack = new Track(this.modulePrefix, trackInfo);

    newTrack.on('dragstart', (track, e) => {
      e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);
      const allTracks = this.tracks.map(t => t.getContainer());
      const trackEl = track.getContainer();
      trackReorderDrag(e, trackEl, allTracks);
    });

    newTrack.on('dragend', () => {
      // Reorder components according to their position.
      const beforeReordering = JSON.stringify(this.html.container);
      this.tracks.sort((t1, t2) => {
        return t1.getContainer().getBoundingClientRect().top >
               t2.getContainer().getBoundingClientRect().top;
      });

      // Trigger change if elements were reordered
      const afterReordering = JSON.stringify(this.html.container);
      if (beforeReordering !== afterReordering) {
        this.trigger('change');
      }
    });

    newTrack.on('deleteBtnClick', () => {
      const trackIndex = this.tracks.indexOf(newTrack);
      assert(trackIndex !== -1, 'Invalid track being deleted.');
      this.tracks = removeIndex(this.tracks, trackIndex);
      newTrack.destroy();
      this.trigger('change');
    });

    this.html.container.appendChild(newTrack.getContainer());
    this.tracks.push(newTrack);
    return newTrack;
  }
}
