import ViewController from './ViewController';
import constants from './utils/constants';

export default class Track extends ViewController {

  constructor(modulePrefix, info) {
    super(modulePrefix, info);
    this.info = info;
    Object.preventExtensions(this);

    this.acceptEvents('dragstart', 'dragend', 'deleteBtnClick');
  }

  buildHtml(info) {
    super.buildHtml();

    // Create HTML

    const coverImg = document.createElement('img');
    coverImg.classList.add(`${this.cssPrefix}-cover`);
    coverImg.setAttribute('src', info.album.images[1].url);
    this.html.container.appendChild(coverImg);

    const linearGradients = 'linear-gradient(rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0.94))';
    this.html.container.style.background = `url("${info.album.images[1].url}"), ${linearGradients}`;

    const trackInfoClass = `${this.cssPrefix}-info`;
    const trackInfo = document.createElement('div');
    trackInfo.classList.add(trackInfoClass);
    this.html.container.appendChild(trackInfo);

    const title = document.createElement('span');
    title.classList.add(`${trackInfoClass}-title`);
    title.innerHTML = info.name;
    trackInfo.appendChild(title);

    const artist = document.createElement('span');
    artist.classList.add(`${trackInfoClass}-artist`);
    artist.innerHTML = info.artists[0].name;
    trackInfo.appendChild(artist);

    if (info.explicit) {
      const explicit = document.createElement('span');
      explicit.classList.add(`${trackInfoClass}-explicit`);
      explicit.innerHTML = 'explicit';
      trackInfo.appendChild(explicit);
    }

    const buttonsBar = document.createElement('div');
    const buttonsBarClass = `${this.cssPrefix}-btns`;
    buttonsBar.classList.add(buttonsBarClass);
    this.html.container.appendChild(buttonsBar);

    const dragBtn = document.createElement('button');
    dragBtn.innerHTML = constants.dragIcon;
    dragBtn.setAttribute('draggable', 'true');
    dragBtn.classList.add(`${buttonsBarClass}-drag`);
    this.html.container.dragBtn = dragBtn;
    buttonsBar.appendChild(dragBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add(`${buttonsBarClass}-delete`);
    this.deleteBtn = deleteBtn;
    deleteBtn.innerHTML = constants.trashIcon;
    buttonsBar.appendChild(deleteBtn);

    // Set listeners

    const draggingClass = `${this.cssPrefix}--dragging`;
    dragBtn.addEventListener('dragstart', (e) => {
      this.trigger('dragstart', e);
      this.html.container.classList.add(draggingClass);
    });

    dragBtn.addEventListener('dragend', (e) => {
      this.trigger('dragend', e);
      setTimeout(() => this.html.container.classList.remove(draggingClass), 100);
    });

    deleteBtn.addEventListener('click', () => this.trigger('deleteBtnClick'));
  }

}
