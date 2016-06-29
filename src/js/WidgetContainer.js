import ViewController from './ViewController';
import assert from 'fl-assert';

const INFO_DISPLAY_DURATION = 4000;
export default class WidgetContainer extends ViewController {

  constructor(modulePrefix) {
    super(modulePrefix);
    this.infoTimeout = null;
    Object.preventExtensions(this);
  }

  buildHtml() {
    super.buildHtml();
    const info = document.createElement('span');
    this.html.info = info;
    info.classList.add(`${this.cssPrefix}-info`);
    this.html.container.appendChild(info);

    const mySongsTab = document.createElement('div');

    const searchBox = document.createElement('span');
    this.html.searchBox = searchBox;
    mySongsTab.appendChild(searchBox);

    const tracksContainer = document.createElement('div');
    this.html.tracksContainer = tracksContainer;
    tracksContainer.classList.add(`${this.cssPrefix}-tracksContainer`);
    mySongsTab.appendChild(tracksContainer);

    const userTrackList = document.createElement('div');
    this.html.userTrackList = userTrackList;
    userTrackList.classList.add(`${this.cssPrefix}-trackList`);
    tracksContainer.appendChild(userTrackList);

    const searchResults = document.createElement('div');
    this.html.searchResults = searchResults;
    searchResults.classList.add(`${this.cssPrefix}-searchResults`);
    tracksContainer.appendChild(searchResults);

    const fullPlaylistTab = document.createElement('div');
    fullPlaylistTab.classList.add(`${this.cssPrefix}-fullPlaylistTab`);

    const fullTrackList = document.createElement('div');
    fullPlaylistTab.appendChild(fullTrackList);
    this.html.fullTrackList = fullTrackList;

    const tabs = this.createTabs(
      ['My songs', 'Full Playlist'],
      [mySongsTab, fullPlaylistTab]
    );

    this.html.container.appendChild(tabs);
  }

  /**
   * Creates tabs given titles and contents
   * @private
   * @method createTabs
   * @param  {Array<String>} labels - Tab titles
   * @param  {Array<HTMLElements>} contents
   * @return {HTMLElement}
   */
  createTabs(labels, contents) {
    assert(labels.length === contents.length,
      `Invalid arguments. tabLabels of size ${labels.length} and tabContents of size ${contents.length}`); // eslint-disable-line max-len
    const tabsClass = `${this.cssPrefix}-tabs`;
    const labelClass = `${tabsClass}-label`;
    const labelSelectedClass = `${labelClass}--selected`;
    const tabClass = `${tabsClass}-content`;
    const tabVisibleClass = `${tabClass}--visible`;

    const tabsContainer = document.createElement('div');
    tabsContainer.classList.add(tabsClass);

    const tabLabels = document.createElement('ul');
    tabLabels.classList.add(`${tabsClass}-labels`);
    tabsContainer.appendChild(tabLabels);

    const tabContents = document.createElement('ul');
    tabContents.classList.add(`${tabsClass}-contents`);
    tabsContainer.appendChild(tabContents);

    function showTab(tabIndex) {
      const labelElements = Array.from(tabLabels.children);
      labelElements.forEach(l => l.classList.remove(labelSelectedClass));
      labelElements[tabIndex].classList.add(labelSelectedClass);

      const contentElements = Array.from(tabContents.children);
      contentElements.forEach(t => t.classList.remove(tabVisibleClass));
      contentElements[tabIndex].classList.add(tabVisibleClass);
    }

    // Create elements
    for (let i = 0; i < contents.length; i++) {
      const tabLabel = document.createElement('li');
      tabLabel.classList.add(labelClass);
      tabLabel.innerHTML = labels[i];
      tabLabels.appendChild(tabLabel);
      tabLabel.addEventListener('click', () => showTab(i));

      const tabContent = document.createElement('li');
      tabContent.classList.add(tabClass);
      tabContent.appendChild(contents[i]);
      tabContents.appendChild(tabContent);
    }

    showTab(0);
    return tabsContainer;
  }

  /**
   * Sets a ViewController instance as one of the container's elements.
   * @public
   * @method set
   * @param  {String} name
   * @param  {ViewController} instance
   */
  set(name, instance) {
    assert(this.html[name], `Trying to set invalid property: ${name}`);
    this.html[name].parentNode.replaceChild(instance.html.container, this.html[name]);
    this.html[name] = instance.html.container;
  }

  /**
   * Displays a message for a certain period of time
   * @method displayInfo
   * @param  {String} message
   * @param  {Int} duration
   * @return {void}
   */
  displayInfo(message, error = false, duration = INFO_DISPLAY_DURATION) {
    const errorClass = `${this.cssPrefix}-info--error`;
    const successClass = `${this.cssPrefix}-info--success`;
    this.html.info.classList.remove(errorClass, successClass);
    this.html.info.innerHTML = message;
    if (error) {
      this.html.info.classList.add(errorClass);
    } else {
      this.html.info.classList.add(successClass);
    }
    this.errorTimeout = setTimeout(
      () => {
        this.html.info.classList.remove(errorClass, successClass);
        this.html.info.innerHTML = '';
      },
      duration
    );
  }
}
