import SubmissionBox from './SubmissionBox';
import WidgetContainer from './WidgetContainer';

export default class ModuleCoordinator {
  constructor(modulePrefix) {
    this.submissionBox = new SubmissionBox(modulePrefix);
    this.widgetContainer = new WidgetContainer(modulePrefix);
    Object.preventExtensions(this);

    this.widgetContainer.set('submissionBox', this.submissionBox);
  }

  /**
   * @private
   * @method submitTrack
   * @return {void}
   */
  submitTrack() {
    const trackUri = this.submissionBox.getInput();
    if (this.isValid(trackUri)) {
      console.log('valid track', trackUri);
    } else {
      console.log('invalid track', trackUri);
    }
  }

  /**
   * @private
   * @method isValid
   * @param  {String} trackUri
   * @return {Boolean}
   */
  isValid(trackUri) {
    const validationRegex = /^https:\/\/open.spotify.com\/track\/\w{22}$/;
    return validationRegex.test(trackUri);
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
