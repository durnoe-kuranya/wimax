require('../scripts/hataModel.js');

describe("Hata Model Module", function () {
	var hataModel;

	beforeEach(function () {
		hataModel = new WM.HataModel();
	});

	it("Should be created without exceptions", function () {
		hataModel = new WM.HataModel();
	});

	it("Should have all the parameters being defined", function () {

		expect(hataModel.betta1).toBeDefined();
		expect(hataModel.betta2).toBeDefined();

		expect(hataModel.betta3).toBeDefined();

		expect(hataModel.f1).toBeDefined();
		expect(hataModel.f2).toBeDefined();

		expect(hataModel.alphaHAs).toBeDefined();

		expect(hataModel.gamma1).toBeDefined();
		expect(hataModel.gamma2).toBeDefined();

		expect(hataModel.alphaUGamma).toBeDefined();
		expect(hataModel.alphaB).toBeDefined();

		for (var i in hataModel) {
			if (hataModel.hasOwnProperty(i)) {
				console.log(i + " " + hataModel[i]);
			}
		}
	});

	describe("Get signal loss", function () {
		it("should return defined values", function () {
			var i, r;

			r = 10;

			for (i = 0; i < 100; i += 1) {
				r += 10;

				var signal = hataModel.getSignalLoss(r);

				expect(signal).toBeDefined();

				console.log('for r: ' + r + ' signal loss is: ' + signal);
			}
		});
	});

	describe("Get radius", function () {
		it("should return definit value", function () {
			var radius = hataModel.getRadius();

			expect(radius).toBeDefined();
			expect(radius).not.toBe(NaN);
			expect(radius).not.toBe(Infinity);

			console.log('Radius is ' + radius);
		});
	});

	describe("Get signal power", function () {
		it("should return definit values", function () {
			var i, r;

			r = 10;

			for (i = 0; i < 100; i += 1) {
				r += 10;

				var signal = hataModel.getSignalPower(r);

				expect(signal).toBeDefined();

				console.log('for r: ' + r + ' signal power is: ' + signal);
			}
		});
	});
});

