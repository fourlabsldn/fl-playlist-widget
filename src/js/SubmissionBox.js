import ViewController from './ViewController';
import assert from 'fl-assert';

export default class SubmissionBox extends ViewController {
  constructor(modulePrefix) {
    super(modulePrefix);
    this.acceptEvents('submit');
  }

  buildHtml() {
    super.buildHtml();

    const submitBtn = document.createElement('button');
    this.html.submitBtn = submitBtn;
    submitBtn.innerHTML = `
    <svg
       xmlns:dc="http://purl.org/dc/elements/1.1/"
       xmlns:cc="http://creativecommons.org/ns#"
       xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
       xmlns:svg="http://www.w3.org/2000/svg"
       xmlns="http://www.w3.org/2000/svg"
       version="1.1"
       id="svg2"
       viewBox="0 0 333.9721 382.85264"
       height="1em"
       width="1em">
      <defs
         id="defs4" />
      <metadata
         id="metadata7">
        <rdf:RDF>
          <cc:Work
             rdf:about="">
            <dc:format>image/svg+xml</dc:format>
            <dc:type
               rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
            <dc:title></dc:title>
          </cc:Work>
        </rdf:RDF>
      </metadata>
      <g
         transform="translate(-18.777104,-32.548383)"
         id="layer1">
        <path
           d="m 74.949777,414.69224 c -24.36158,-3.6749 -45.24612,-21.2619 -53.32035,-44.9015 -3.04674,-8.9201 -3.80818,-26.9045 -1.52529,-36.0258 4.6794,-18.6966 18.09492,-35.6783 34.62255,-43.826 18.42598,-9.0836 39.16235,-9.5299 57.452803,-1.2366 3.74629,1.6986 6.97419,3.0884 7.17312,3.0884 0.19892,0 0.36636,-43.3125 0.37208,-96.25 l 0.0104,-96.249957 114.2396,-32.79881 c 62.83178,-18.03934 115.25996,-33.05638 116.50706,-33.3712 l 2.26746,-0.57239 -0.26746,136.371197 -0.26746,136.37116 -2.21768,6.5153 c -6.70708,19.7046 -22.23229,35.3047 -42.16457,42.368 -7.85242,2.7826 -9.72786,3.0538 -21.11775,3.0538 -11.38989,0 -13.26533,-0.2712 -21.11775,-3.0538 -20.22765,-7.168 -35.96639,-23.1703 -42.17692,-42.8833 -3.17523,-10.0785 -3.16898,-29.9586 0.0126,-40 5.3142,-16.7722 17.76312,-31.2302 33.50929,-38.917 9.73365,-4.7518 20.84978,-7.583 29.77278,-7.583 7.93755,0 19.80739,2.7821 27.75,6.504 l 7.25,3.3975 0,-57.51814 c 0,-54.31114 -0.0976,-57.48902 -1.75,-56.99659 -0.9625,0.28682 -36.4,10.4687 -78.75,22.62639 -42.35,12.1577 -80.0375,22.9974 -83.75,24.08824 l -6.75,1.98333 -0.0148,94.70767 c -0.0164,104.8978 0.20224,101.0758 -6.56607,114.7947 -12.60307,25.5456 -41.16979,40.5402 -69.183663,36.3144 z"
           id="path4149" />
      </g>
    </svg>
    `;
    submitBtn.classList.add(`${this.cssPrefix}-submitBtn`, 'btn', 'btn-default');
    this.html.container.appendChild(submitBtn);
    submitBtn.addEventListener('click', () => {
      this.trigger('submit');
    });

    const textInput = document.createElement('input');
    this.html.textInput = textInput;
    textInput.setAttribute('type', 'text');
    textInput.classList.add(`${this.cssPrefix}-textInput`, 'form-control');
    this.html.container.appendChild(textInput);
  }

  /**
   * @public
   * @method getInput
   * @return {String}
   */
  getInput() {
    return this.html.textInput.value.trim();
  }

  /**
   * @public
   * @method setInput
   * @param  {String} text
   */
  setInput(text) {
    assert(typeof text === 'string',  `Invalid value for inputText: ${text}`);
    this.html.textInput.value = text;
  }
}
