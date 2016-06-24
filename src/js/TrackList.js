import ViewController from './ViewController';
import Track from './Track';
import assert from 'fl-assert';
import trackReorderDrag from './utils/trackReorderDrag';
import removeIndex from './utils/removeIndex';

export default class TrackList extends ViewController {
  constructor(modulePrefix, rearrageable = true) {
    super(modulePrefix);
    this.tracks = [];
    this.rearrageable = rearrageable;
    Object.preventExtensions(this);

    this.acceptEvents('trackReorder');
  }

  buildHtml() {
    super.buildHtml();
  }

  getTracks() {
    return this.tracks.map(t => t.getInfo());
  }

  /**
   * @public
   * @method setTracks
   * @param  {Array<Object>} tracks
   */
  setTracks(tracks) {
    if (tracks[0]) tracks[0].playing = true;
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
    const newTrack = new Track(this.modulePrefix, trackInfo, this.rearrageable);

    newTrack.on('dragstart', (track, e) => {
      e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);
      // Rearrange all tracks except the one playing
      const allTracks = this.tracks.filter(t => !t.info.playing).map(t => t.getContainer());
      const trackEl = track.getContainer();

      trackReorderDrag(e, trackEl, allTracks)
      // When drag has finished and elements have been reordered
      // We use this promise instead of listening to newTrack.on('dragend')
      // because the trigger('trackReorder') would be triggered before
      // trackReorderDrag and thus could remove the elements it was dragging.
      .then(() => {
        // Reorder components according to their position.
        const beforeReordering = JSON.stringify(this.tracks);
        this.tracks.sort((t1, t2) => {
          return getElementIndex(t1.getContainer()) >
                 getElementIndex(t2.getContainer());
        });

        // Trigger change if elements were reordered
        const afterReordering = JSON.stringify(this.tracks);
        if (beforeReordering !== afterReordering) {
          this.trigger('trackReorder');
        }
      });
    });

    newTrack.on('deleteBtnClick', () => {
      const trackIndex = this.tracks.indexOf(newTrack);
      assert(trackIndex !== -1, 'Invalid track being deleted.');
      this.tracks = removeIndex(this.tracks, trackIndex);
      newTrack.destroy();
      this.trigger('trackReorder');
    });

    this.html.container.appendChild(newTrack.getContainer());
    this.tracks.push(newTrack);
    return newTrack;
  }
}

function getElementIndex(el) {
  let node = el;
  let i = 0;
  while (node !== null) {
    node = node.previousSibling;
    i++;
  }
  return i;
}
