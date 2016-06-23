import assert from 'fl-assert';

export default class Ajax {
  constructor(url, defaultParameters = {}) {
    assert(url, 'No URL provided on instantiation');
    this.url = url;
    this.defaultParameters = defaultParameters;
  }

  async query(params, url = this.url) {
    console.log('LOADING FROM SERVER');
    const requestUrl = this.addParametersToUrl(url, this.defaultParameters, params);
    const requestConfig = {
      method: 'GET',
      cache: 'no-cache',
      // credentials: 'include',
    };

    let response;
    try {
      response = await fetch(requestUrl, requestConfig);
    } catch (e) {
      throw new Error('Error connecting to server.');
    }

    try {
      const content = await response.json();
      return content;
    } catch (e) {
      throw new Error('Invalid server response.');
    }
  }

  /**
   * Adds parameters as GET string parameters to a prepared URL
   * @private
   * @method _addParametersToUrl
   * @param  {String} url
   * @param  {Object} params
   * @return {String} The full URL with parameters
   */
  // TODO: this must be more robust. What about www.asdf.com/, www.asdf.com/?, www.asdf.com
  addParametersToUrl(url = this.url, ...paramObjects) {
    const getParams = [];
    for (const params of paramObjects) {
      const keys = Object.keys(params);
      for (const key of keys) {
        const value = params[key] !== undefined && params[key] !== null
          ? params[key].toString()
          : '';
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(value);
        getParams.push(`${encodedKey}=${encodedValue}`);
      }
    }

    const encodedGetParams = getParams.join('&');
    const fullUrl = `${url}?${encodedGetParams}`;
    return fullUrl;
  }
}
