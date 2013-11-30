(function (global) {
	'use strict';

	function log10(val) {
		return Math.log(val) / Math.LN10;
	}

	function extend(descendant, parent) {
		var key;

		for (key in parent) {
			if (parent.hasOwnProperty(key)) {
				descendant[key] = parent[key];
			}
		}

		return descendant;
	}

	function HataModel(options) {
		var defaults = {
				//Base station height [100, 300] meters
				hBs: 20,
				//Consumer station height [1,3] meters
				hAs: 4,
				//Frequency [100; 3*1000] MHz
				f: 2500,
				//City type coefficient 1 (big city), 0 (small or medium town)
				U: 0,
				//Terrain type. 1 (city), 0.5 (nature) or 0 (village)
				uGamma: 0,
				//Housing density [3,50]%
				b: 0.2,
				//Starting power
				p: 100,
				//Margin fade
				s: 30,
				//Required signal
				q: -153
			},
			opts = extend(defaults, options),
			self = this;

		this.betta1 = (function getBetta1() {
			return (0.7 - 1.1 * log10(opts.f)) * opts.hAs
				+ 1.56 * log10(opts.f) - 0.8;
		}());

		this.betta2 = (function getBetta2() {
			var lg = log10(1.54 * opts.hAs);

			return 1.1 - 8.29 * lg * lg;
		}());

		this.betta3 = (function getBetta3() {
			var lg = log10(11.75 * opts.hAs);

			return 4.97 - 3.2 * lg * lg;
		}());

		this.f1 = (function getF1() {
			var three100up4 = Math.pow(300, 4);

			return three100up4
				/ (Math.pow(opts.f, 4) + three100up4);
		}());

		this.f2 = (function getF2() {
			var fUp4 = Math.pow(opts.f, 4),
				three100up4 = Math.pow(300, 4);

			return fUp4
				/ (fUp4 + three100up4);
		}());

		//The coefficient that depends on base station's
		//height and city's size.
		this.alphaHAs = (function getAlphaHAs() {
			return (1 - opts.U) * self.betta1
				+ (self.betta2 * self.f1 + self.betta3 * self.f2) * opts.U;
		}());

		this.gamma1 = (function getGamma1() {
			var lg = log10(opts.f);

			return -4.78 * lg * lg
				+ 18.33 * lg - 40.94;
		}());

		this.gamma2 = (function getGamma2() {
			var lg = log10(opts.f / 28);

			return -2 * lg * lg
				- 5.4;
		}());

		//The coefficient that depends on terrain type
		this.alphaUGamma = (function getAlphaHAs() {
			return (1 - opts.uGamma)
				* ((1 - 2 * opts.uGamma) * self.gamma1
				+ 4 * opts.uGamma * self.gamma2);
		}());

		//The coefficient that depends on housing density.
		this.alphaB = (function alphaB() {
			return 25 * log10(opts.b) - 30;
		}());

		//The coefficient that depends on the Earth's radius
		//R0 - line-of-sight
		//Use the coefficient when 0.2R0 < r < 0.8R0
		//TODO: implement this condition
		this.getAlphaHbs = function getAlphaHbsF(r) {
			var hBsPlus20 = opts.hBs + 20,
				rUp2 = r * r;

			return (27 + opts.f / 230)
				* log10((17 * hBsPlus20) / ((17 * hBsPlus20) + rUp2))
				+ 1.3 - Math.abs((opts.f - 55)) / 750;
		};


		//Returns wimax signal power loss depending on model options
		//and r - distance between the base station and a
		//consumer station
		this.getSignalLoss = function (r) {
			return 69.55 + 26.16 * log10(opts.f)
				- 13.82 * log10(opts.hBs)
				+ 44.9 - 6.55 * log10(opts.hBs) * log10(r)
				+ self.alphaHAs
				+ self.alphaUGamma
				- self.getAlphaHbs(r)
				+ self.alphaB;
		};

		//returns signal power at the r distance from
		//the base station
		this.getSignalPower = function (r) {
			var signal = opts.p - self.getSignalLoss(r) - opts.s;

			return signal;
		};

		this.getRadius = function () {
			var signal, r = 1;

			signal = self.getSignalPower(r);

			//self.q - minimal required signal
			while (signal > opts.q) {
				r += 10;
				signal = self.getSignalPower(r);
			}

			return r;
		};
	}

	(function exports() {
		global.WM = global.WM || {
			HataModel: HataModel
		};
	}());

}(this));