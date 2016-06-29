import assert from 'fl-assert';

export default class Ajax {
  constructor(url, defaultParameters = {}) {
    assert(url, 'No URL provided on instantiation');
    this.url = url;
    this.defaultParameters = defaultParameters;
  }

  /**
   * Send a GET request
   * @public
   * @method get
   * @param  {Object} params - Will be sent with the request together with this.defaultParameters
   * @param  {String} url
   * @return {Promise<Object>} The parsed JSON response
   */
  async get(params = {}, url = this.url) {
    console.log('LOADING FROM SERVER');
    const requestUrl = this.addParametersToUrl(url, this.defaultParameters, params);
    const requestConfig = {
      method: 'GET',
      cache: 'no-cache',
      redirect: 'follow',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      // credentials: 'include',
    };

    return this.sendRequest(requestConfig, requestUrl);
  }

  /**
   * Send a POST request
   * @public
   * @method post
   * @param  {Object} params - Will be sent with the request together with this.defaultParameters
   * @param  {String} url
   * @return {Promise<Object>} The parsed JSON response
   */
  async post(params = {}, url = this.url) {
    // Create requestBody with content from params and this.defaultParameters
    const requestBody = {};
    for (const key of Object.keys(params)) {
      requestBody[key] = params[key];
    }
    for (const key of Object.keys(this.defaultParameters)) {
      requestBody[key] = this.defaultParameters[key];
    }

    const config = {
      method: 'POST',
      redirect: 'follow',
      mode: 'cors',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(requestBody),
    };

    return this.sendRequest(config, url);
  }

  /**
   * @private
   * @method sendRequest
   * @param  {Object} config
   * @param  {String} url
   * @return {Promise<Object>} The parsed JSON response
   */
  async sendRequest(config, url = this.url) {
    let response;
    try {
      response = await fetch(url, config);
    } catch (e) {
      throw new Error('Error connecting to server.');
    }

    let content;
    try {
      content = await response.json();
    } catch (e) {
      throw new Error('Invalid server response.');
    }

    return content;
  }

  /**
   * Adds parameters as GET string parameters to a prepared URL
   * @private
   * @method addParametersToUrl
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
