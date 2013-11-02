/**
 * Created with JetBrains WebStorm.
 * User: Neurosis
 * Date: 02.11.13
 * Time: 10:49
 * To change this template use File | Settings | File Templates.
 */
(function (window, undefined) {
	'use strict';

	(function exports() {
		window.WM = window.WM || {
			HataModel: HataModel
		};
	}());

	function log10(val) {
		return Math.log(val) / Math.LN10;
	}

	function HataModel(options) {
		var defaults = {
			//Base station height [100, 300] meters
			hBs: 32,
			//Consumer station height [1,3] meters
			hAs: 1.7,
			//Frequency [100*1000*1000; 3*1000*1000*1000] Hz
			f: 2500 * 1000 * 1000,
			//City type coefficient 1 (big city) or 0 (small or medium town)
			U: 1,
			//Terrain type. 1 (city), 0.5 (nature) or 0 (village)
			uGamma: 1,
			//Housing density [3,50] %
			b: 35
		};

		var options = $.extend(defaults, options);

		this.betta1 = (function getBetta1() {
			return (0.7 - 1.1 * log10(options.f)) * options.hAs
				+ 1.56 * log10(options.f) - 0.8;
		}());

		this.betta2 = (function getBetta2() {
			var lg = log10(1.54 * options.hAs);

			return 1.1 - 8.29 * lg * lg;
		}());

		this.betta3 = (function getBetta3() {
			var lg = log10(11.75 * options.hAs);

			return 4.97 - 3.2 * lg * lg;
		}());

		this.f1 = (function getF1() {
			var three100up4 = Math.pow(4, 300);

			return three100up4
				/ (Math.pow(4, options.f) + three100up4);
		}());

		this.f2 = (function getF2() {
			var fUp4 = Math.pow(4, options.f),
				three100up4 = Math.pow(4, 300);

			return fUp4
				/ (fUp4 + three100up4);
		}());

		//The coefficient that depends on base station's
		//height and city's size.
		this.alphaHAs = (function getAlphaHAs() {
			return (1 - this.options.U) * this.getBetta1
				+ (this.betta1 * this.f1 + this.betta3 * this.f2) * options.U;
		}());

		this.gamma1 = (function getGamma1() {
			var lg = log10(options.f);

			return 4.78 * lg * lg
				- 18.33 * lg + 40.94;
		}());

		this.gamma2 = (function getGamma2() {
			var lg = log10(options.f / 28);

			return 2 * lg * lg
				+ 5.4;
		}());

		//The coefficient that depends on terrain type
		this.alphaUGamma = (function getAlphaHAs() {
			return (1 - options.uGamma)
				* ((1 - 2 * options.uGamma) * this.gamma1
				+ 4 * options.uGamma * this.gamma2);
		}());

		//The coefficient that depends on housing density.
		this.alphaB = (function alphaB() {
			return 25 * log10(options.b) - 30;
		}());

		//The coefficient that depends on the Earth's radius
		//R0 - line-of-sight
		//Use the coefficient when 0.2R0 < r < 0.8R0
		//TODO: implement this condition
		this.alphaHbsF = (function getAlphaHbsF(r) {
			var hBsPlus20 = options.hBs + 20,
				rUp2 = r * r;

			return (27 + options.f / 230)
				* log10((17 * hBsPlus20) / ((17 * hBsPlus20) + rUp2))
				+ 1.3 - (options.f - 55) / 750;
		}());

		//Returns wimax signal power depending on model options
		//and r - distance between the base station and a
		//consumer station
		this.getSignal = function(r) {
			return 69.55 + 26.16 * log10(options.f)
				- 13.82 * log10(options.hBs)
				+ (44.9 - 6.55 * log10(options.hBs)) * log10(r)
				+ this.alphaHAs
				+ this.alphaUGamma
				+ this.alphaB
				+ this.alphaHbsF;
		}
	}
}(window));