import TrackList from './TrackList'; 
import SubmissionBox from './SubmissionBox';
import WidgetContainer from './WidgetContainer';

export default class ModuleCoordinator {
  constructor(modulePrefix) {
    this.submissionBox = new SubmissionBox(modulePrefix);
    this.widgetContainer = new WidgetContainer(modulePrefix);
    this.trackList = new TrackList(modulePrefix);
    Object.preventExtensions(this);

    this.widgetContainer.set('submissionBox', this.submissionBox);
    this.widgetContainer.set('trackList', this.trackList);
    this.submissionBox.on('submit', () => this.submitTrack());
  }

  /**
   * @private
   * @method submitTrack
   * @return {void}
   */
  submitTrack() {
    const trackUri = this.submissionBox.getInput();
    if (this.isValid(trackUri)) {
      this.widgetContainer.displayInfo('Valid track');
      console.log('valid');
    } else {
      this.widgetContainer.displayInfo('Invalid track', true);
      console.log('invalid');
    }
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
    return linkValidation.test(trackUri) || uriValidation.test(trackUri);
  }

  /**
   * @public
   * @method getWidget
   * @return {[type]} [description]
   */
  getWidget() {
    return this.widgetContainer.getContainer();
  }
}
