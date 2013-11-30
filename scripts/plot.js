/*global WM, jQuery*/
(function ($, WM) {
	'use strict';

	function getOptions() {

		var options = {
			hBs: parseFloat($('#hBs').val()),
			hAs: parseFloat($('#hAs').val()),
			f: parseFloat($('#f').val()),
			U: parseFloat($('#terrain-type').val()),
			uGamma: parseFloat($('#house-density').val()),
			b: parseFloat($('#house-density').val()),
			p: parseFloat($('#base-power').val()),
			s: parseFloat($('#margin-fade').val()),
			q: parseFloat($('#required-signal').val())
		};

		return options;
	}

	$(function () {
		$('#plot-button').click(function (event) {
			var options, hm;

			options = getOptions();
			hm = new WM.HataModel(options);

			(function plot() {
				var r = 1,
					i = 0,
					signalPlotPoints = [],
					requiredSignal = [],
					signal;

				for (i = 0; i < 100; i += 1) {
					signal = hm.getSignalPower(r);

					signalPlotPoints.push([r, signal]);
					requiredSignal.push([r, options.q]);

					r += 100;
				}

				$('.plot-wrapper').show();

				$.plot("#signal-plot", [
					{label: "Мощность сигнала", color: "black", data: requiredSignal },
					{label: "Пороговый сигнал", color: "blue", data: signalPlotPoints }
				]);
			}());

			event.preventDefault();
		});
	});
}(jQuery, WM));