import assert from 'fl-assert';
/**
 * This class creates elements with an html counterpart.
 * HTML components are stored in this.html, and the main container
 * is this.html.container.
 * @abstract @class
 */

export default class ViewController {
  constructor(modulePrefix, ...additionalArgs) {
    this.listeners = {};
    this.acceptEvents('destroy');

    this.modulePrefix = modulePrefix;
    this.cssPrefix = `${this.modulePrefix}_${this.constructor.name}`;

    this.buildHtml(...additionalArgs);
  }

  /**
   * Creates the HTML structure of the class
   * @private
   * @method buildHtml
   * @return {void}
   */
  buildHtml() {
    this.html = {};
    this.html.container = document.createElement('div');
    this.html.container.classList.add(this.cssPrefix);
  }

  /**
   * Sets which events will be accepted.
   * @method acceptEvents
   * @param  {Array<String>} eventList
   * @return {void}
   */
  acceptEvents(...eventList) {
    for (const eventName of eventList) {
      this.listeners[eventName] = new Set();
    }
  }

  /**
   * @method on
   * @param  {function} fn
   * @param {String} event
   * @return {void}
   */
  on(event, fn) {
    assert(this.listeners[event], `Trying to listen to invalid event: ${event}`);
    this.listeners[event].add(fn);
  }

  /**
   * @method removeListener
   * @param  {String} event
   * @param  {Function} fn
   * @return {void}
   */
  removeListener(event, fn) {
    assert(this.listeners[event], `Trying to remove listener from invalid event: ${event}`);
    this.listeners[event].delete(fn);
  }

  /**
   * @method trigger
   * @param  {String} event
   */
  trigger(event, ...additionalArgs) {
    assert(this.listeners[event], `Trying to trigger listener from invalid event: ${event}`);
    this.listeners[event].forEach(fn => fn(this, ...additionalArgs));
  }

  destroy() {
    this.trigger('destroy');
    this.html.container.classList.add('DESTROYED');
    this.html.container.remove();
    const keys = Object.keys(this);
    for (const key of keys) {
      this[key] = null;
    }
    this.html = {};
  }

  getContainer() {
    return this.html.container;
  }
}
