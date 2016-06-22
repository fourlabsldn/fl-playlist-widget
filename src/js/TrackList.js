import ViewController from './ViewController';
import assert from 'fl-assert';

export default class TrackList extends ViewController {
  constructor(modulePrefix) {
    super(modulePrefix);
    this.tracks = [
      {
        "album" : {
          "album_type" : "album",
          "available_markets" : [ "AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "GB", "AD", "MC", "ID" ],
          "external_urls" : {
            "spotify" : "https://open.spotify.com/album/0TN9abNwnSnMW3jxw6uIeL"
          },
          "href" : "https://api.spotify.com/v1/albums/0TN9abNwnSnMW3jxw6uIeL",
          "id" : "0TN9abNwnSnMW3jxw6uIeL",
          "images" : [ {
            "height" : 640,
            "url" : "https://i.scdn.co/image/da88959a881cdc64bd576383c755fec0af2ca5f5",
            "width" : 640
          }, {
            "height" : 300,
            "url" : "https://i.scdn.co/image/6d2190a9b3f711b57e6ee924fa343239a36752df",
            "width" : 300
          }, {
            "height" : 64,
            "url" : "https://i.scdn.co/image/66f1b8e6703f912ffd76947ab8ab428a87e44ed0",
            "width" : 64
          } ],
          "name" : "Total Life Forever",
          "type" : "album",
          "uri" : "spotify:album:0TN9abNwnSnMW3jxw6uIeL"
        },
        "artists" : [ {
          "external_urls" : {
            "spotify" : "https://open.spotify.com/artist/6FQqZYVfTNQ1pCqfkwVFEa"
          },
          "href" : "https://api.spotify.com/v1/artists/6FQqZYVfTNQ1pCqfkwVFEa",
          "id" : "6FQqZYVfTNQ1pCqfkwVFEa",
          "name" : "Foals",
          "type" : "artist",
          "uri" : "spotify:artist:6FQqZYVfTNQ1pCqfkwVFEa"
        } ],
        "available_markets" : [ "AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "GB", "AD", "MC", "ID" ],
        "disc_number" : 1,
        "duration_ms" : 409560,
        "explicit" : true,
        "external_ids" : {
          "isrc" : "GBAHT1000047"
        },
        "external_urls" : {
          "spotify" : "https://open.spotify.com/track/4i3txPQIUV4eC9g9FBpi9I"
        },
        "href" : "https://api.spotify.com/v1/tracks/4i3txPQIUV4eC9g9FBpi9I",
        "id" : "4i3txPQIUV4eC9g9FBpi9I",
        "name" : "Spanish Sahara",
        "popularity" : 60,
        "preview_url" : "https://p.scdn.co/mp3-preview/75d32af506df2354251f80726ab3e0656fa8e8f7",
        "track_number" : 5,
        "type" : "track",
        "uri" : "spotify:track:4i3txPQIUV4eC9g9FBpi9I"
      }
    ];

    this.setTracks(this.tracks);
  }

  buildHtml() {
    super.buildHtml();
  }

  getTracks() {

  }

  setTracks(tracks) {
    this.html.container.innerHTML = '';
    assert(Array.isArray(tracks), `Invalid tracks object. Not an array: "${tracks}"`);
    tracks.forEach(track => {
      const trackEl = this.createTrackEl(track);
      this.html.container.appendChild(trackEl);
    });
    this.tracks = tracks;
  }

  /**
   * @method createTrackEl
   * @param  {Object} track
   * @return {HTMLElement}
   */
  createTrackEl(track) {
    const trackClass = `${this.cssPrefix}-track`;
    const trackEl = document.createElement('div');
    trackEl.classList.add(trackClass);

    const coverImg = document.createElement('img');
    coverImg.classList.add(`${trackClass}-cover`);
    coverImg.setAttribute('src', track.album.images[1].url);
    trackEl.appendChild(coverImg);

    const trackInfoClass = `${trackClass}-info`;
    const trackInfo = document.createElement('div');
    trackInfo.classList.add(trackInfoClass);
    trackEl.appendChild(trackInfo);

    const title = document.createElement('span');
    title.classList.add(`${trackInfoClass}-title`);
    title.innerHTML = track.name;
    trackInfo.appendChild(title);

    const artist = document.createElement('span');
    artist.classList.add(`${trackInfoClass}-artist`);
    artist.innerHTML = track.artists[0].name;
    trackInfo.appendChild(artist);

    if (track.explicit) {
      const explicit = document.createElement('span');
      explicit.classList.add(`${trackInfoClass}-explicit`);
      explicit.innerHTML = 'explicit';
      trackInfo.appendChild(explicit);
    }

    return trackEl;
  }
}
