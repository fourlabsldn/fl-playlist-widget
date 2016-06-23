import TrackList from './TrackList';
import SearchResults from './SearchResults';
import SearchBox from './SearchBox';
import WidgetContainer from './WidgetContainer';
import Ajax from './utils/Ajax';
import assert from 'fl-assert';
import debounce from './utils/debounce';

export default class ModuleCoordinator {
  constructor(modulePrefix, userId) {
    this.userId = userId;
    this.searchBox = new SearchBox(modulePrefix);
    this.widgetContainer = new WidgetContainer(modulePrefix);
    this.trackList = new TrackList(modulePrefix);
    this.searchResults = new SearchResults(modulePrefix);
    this.ajax = {};
    Object.preventExtensions(this);

    this.ajax.trackSearch = new Ajax(
      'https://api.spotify.com/v1/search',
      { type: 'track' }
    );

    this.ajax.trackSubmission = new Ajax(
      'https://api.spotify.com/v1/search',
      { userId: this.userId }
    );

    this.ajax.trackLoading = new Ajax(
      'https://api.spotify.com/v1/search',
      { type: 'track', userId: this.userId }
    );

    this.widgetContainer.set('searchBox', this.searchBox);
    this.widgetContainer.set('trackList', this.trackList);
    this.widgetContainer.set('searchResults', this.searchResults);

    this.listenToElementsEvents();
    this.loadChosenTracks();
  }

  /**
   * Called once at instantiation time
   * @private
   * @method listenToElementsEvents
   * @return {void}
   */
  listenToElementsEvents() {
    this.searchBox.on('enterPressed', () => {
      const firstResult = this.searchResults.getFirst();
      if (!firstResult) { return; }
      this.searchResults.setVisible(false);
      this.addTrack(firstResult);
    });

    const debouncedTrackSearch = debounce(200, async () => {
      const searchString = this.searchBox.getInput();
      const tracksFound = await this.searchTrack(searchString);
      if (tracksFound) {
        this.searchResults.setResults(tracksFound);
      }
    });

    this.searchBox.on('usertyping', async (box, keyCode) => {
      const arrowDownCode = 40;
      const arrowUpCode = 38;
      if (keyCode === arrowDownCode || keyCode === arrowUpCode) {
        this.searchResults.startKeyboardNavigation();
      } else {
        debouncedTrackSearch();
      }
    });

    this.searchResults.on('resultClick', (el, trackInfo) => {
      this.addTrack(trackInfo);
    });
  }

  /**
   * @public
   * @method getWidget
   * @return {[type]} [description]
   */
  getWidget() {
    return this.widgetContainer.getContainer();
  }

  /**
   * @private
   * @method displayInfo
   * @param  {String} message
   * @param  {Boolean} isError
   * @return {void}
   */
  displayInfo(message, isError = false) {
    const duration = 2000;
    this.widgetContainer.displayInfo(message, isError, duration);
    this.searchBox.showOutcomeSuccess(!isError, duration);
  }

  /**
   * @private
   * @method addTrack
   * @param  {Object} trackInfo
   */
  addTrack(trackInfo) {
    this.trackList.addTrack(trackInfo);
    this.submitTracks();
  }

  /**
   * Submits all local tracks to server.
   * @private
   * @method submitTrack
   * @return {void}
   */
  async submitTracks() {
    const currentTracks = this.trackList.getTracks();
    await this.ajax.trackSubmission.query({ userId: this.userId, tracks: currentTracks }, 'POST');
    await this.loadChosenTracks();
  }

  /**
   * Loads tracks form the server
   * @method loadChosenTracks
   * @return {tracks}
   */
  async loadChosenTracks() {
    // await this.ajax.loadTracks.query({ tracks: currentTracks }, 'POST');
    const demoTracks = this.trackList.getTracks();
    this.trackList.setTracks(demoTracks);
  }


  /**
   * Queries Spotify for a track based on a string
   * @method searchTrack
   * @param  {String} searchString [description]
   * @return {Array | null}
   */
  async searchTrack(searchString) {
    if (!searchString) { return null; }
    let tracksFound = null;
    try {
      const res = await this.ajax.trackSearch.query({ q: searchString });
      tracksFound = res.tracks.items;
    } catch (e) {
      assert.warn(false, `Error searching tracks: ${e.message}`);
    }
    return tracksFound;
  }
}
