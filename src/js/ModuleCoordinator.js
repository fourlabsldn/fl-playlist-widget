/* globals io */

import TrackList from './TrackList';
import SearchResults from './SearchResults';
import SearchBox from './SearchBox';
import WidgetContainer from './WidgetContainer';
import Ajax from './utils/Ajax';
import assert from 'fl-assert';
import debounce from './utils/debounce';


export default class ModuleCoordinator {
  constructor(modulePrefix, userInfo, serverUrl) {
    this.userId = userInfo.id;
    this.username = userInfo.name;
    this.searchBox = new SearchBox(modulePrefix);
    this.widgetContainer = new WidgetContainer(modulePrefix);
    this.userTrackList = new TrackList(modulePrefix, this.userId);
    this.fullTrackList = new TrackList(modulePrefix, this.userId, false); // non-rearrageable
    this.searchResults = new SearchResults(modulePrefix);
    this.ajax = {};

    assert(io, 'Socket.io not loaded.');
    this.socket = io(serverUrl);

    Object.preventExtensions(this);

    this.ajax.trackSearch = new Ajax(
      'https://api.spotify.com/v1/search',
      { type: 'track' }
    );

    this.ajax.setUserTracks = new Ajax(
      `${serverUrl}/setUserTracks`,
      { user: { id: this.userId, name: this.username } }
    );

    this.ajax.getTrackList = new Ajax(`${serverUrl}/getTrackList`);

    this.widgetContainer.set('searchBox', this.searchBox);
    this.widgetContainer.set('userTrackList', this.userTrackList);
    this.widgetContainer.set('searchResults', this.searchResults);
    this.widgetContainer.set('fullTrackList', this.fullTrackList);

    this.socket.on('playlist_update', (tracks) => this.loadTracks(tracks));
    this.listenToElementsEvents();
    this.loadTracks();
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

    this.userTrackList.on('trackReorder', () => {
      this.submitTracks();
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
   * Adds a track to the user list and trigger tracks update.
   * @private
   * @method addTrack
   * @param  {Object} trackInfo
   */
  addTrack(trackInfo) {
    // Add user credentials to track
    trackInfo.user = { id: this.userId, name: this.username }; // eslint-disable-line no-param-reassign, max-len
    this.userTrackList.addTrack(trackInfo);
    this.submitTracks();
  }

  /**
   * Submits all local tracks to server.
   * @private
   * @method submitTrack
   * @return {void}
   */
  async submitTracks() {
    const tracks = this.userTrackList.getTracks();
    const outcome = await this.ajax.setUserTracks.post({ tracks });
    if (outcome.error) {
      this.widgetContainer.displayInfo(outcome.error, true);
    } else {
      // await this.loadTracks();
    }
  }

  /**
   * Loads tracks form the server
   * @method loadTracks
   * @param {Array} preloadedTracks
   * @return {tracks}
   */
  async loadTracks(preloadedTracks) {
    console.log('Loaded tracks');
    const loadedTracks = preloadedTracks || await this.ajax.getTrackList.get();

    assert(Array.isArray(loadedTracks), 'Invalid tracks object loaded from server.');

    const userTracks = loadedTracks.filter(t => {
      return t.user.id === this.userId;
    });
    this.userTrackList.setTracks(userTracks);
    this.fullTrackList.setTracks(loadedTracks);
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
      const res = await this.ajax.trackSearch.get({ q: searchString });
      tracksFound = res.tracks.items;
    } catch (e) {
      assert.warn(false, `Error searching tracks: ${e.message}`);
    }
    return tracksFound;
  }
}
