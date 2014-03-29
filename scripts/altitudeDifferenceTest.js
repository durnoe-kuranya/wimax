/**
 * Created with JetBrains WebStorm.
 * User: Neurosis
 * Date: 3/29/14
 * Time: 8:45 AM
 * To change this template use File | Settings | File Templates.
 */
(function testAltitudeDifferences(WM, $) {
	'use strict';

	function printAltAndRadius(hAs, radius) {
		var dataRow = WM.templates.altitudeDifferencesTr({hAs: hAs, radius: radius});

		var signalTable = document.querySelector('#signal-table tbody');
		signalTable.innerHTML += dataRow;
	}

	var options = { hAs: 4 };

	var model = new WM.HataModel(options);
	printAltAndRadius(options.hAs, model.getRadius());

	for (var i = 0; i < 9; i++) {
		options.hAs += 1;

		model = new WM.HataModel(options);
		printAltAndRadius(options.hAs, model.getRadius());
	}

}(WM));