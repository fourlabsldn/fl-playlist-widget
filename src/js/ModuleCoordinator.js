import TrackList from './TrackList';
import SearchResults from './SearchResults';
import SubmissionBox from './SubmissionBox';
import WidgetContainer from './WidgetContainer';
import Ajax from './utils/Ajax';
import assert from 'fl-assert';
import throttle from './utils/throttle';
import demoData from './utils/demoData';


export default class ModuleCoordinator {
  constructor(modulePrefix) {
    this.submissionBox = new SubmissionBox(modulePrefix);
    this.widgetContainer = new WidgetContainer(modulePrefix);
    this.trackList = new TrackList(modulePrefix);
    this.searchResults = new SearchResults(modulePrefix);
    this.ajax = {};
    this.ajax.trackSearch = new Ajax('https://api.spotify.com/v1/search');
    Object.preventExtensions(this);

    this.widgetContainer.set('submissionBox', this.submissionBox);
    this.widgetContainer.set('trackList', this.trackList);
    this.widgetContainer.set('searchResults', this.searchResults);
    // this.submissionBox.on('submit', () => this.submitTrack());

    this.submissionBox.on('usertyping', throttle(500, async () => {
      const searchString = this.submissionBox.getInput();
      const tracksFound = await this.searchTrack(searchString);
      if (tracksFound) {
        console.table(tracksFound);
        this.searchResults.setResults(tracksFound);
      }
    }));

    this.searchResults.on('resultClick', (el, trackId) => {
      this.submitTrack(trackId);
      this.loadChosenTracks();
    });
  }


  /**
   * @private
   * @method isValid
   * @param  {String} trackUri
   * @return {Boolean}
   */
  isValid(trackUri) {
    const linkValidation = /^https:\/\/open.spotify.com\/track\/\w{22}$/;
    const uriValidation = /^spotify:track:\w{22}$/;
    const idValidation = /^\w{22}$/;
    return linkValidation.test(trackUri)
      || uriValidation.test(trackUri)
      || idValidation.test(trackUri);
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
    this.submissionBox.showOutcomeSuccess(!isError, duration);
  }


  /**
   * @private
   * @method submitTrack
   * @return {void}
   */
  submitTrack(trackId) {
    if (this.isValid(trackId)) {
      this.displayInfo('Valid track');
    } else {
      this.displayInfo('Invalid track', true);
    }
  }

  /**
   * Loads tracks form the server
   * @method loadChosenTracks
   * @return {tracks}
   */
  loadChosenTracks() {
    this.trackList.setTracks(demoData);
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
      const res = await this.ajax.trackSearch.query({
        type: 'track',
        q: searchString,
      });

      tracksFound = res.tracks.items;
    } catch (e) {
      assert.warn(false, `Error searching tracks: ${e.message}`);
    }
    return tracksFound;
  }
}
