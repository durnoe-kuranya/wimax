/**
 * Created with JetBrains WebStorm.
 * User: Neurosis
 * Date: 3/29/14
 * Time: 8:58 AM
 * To change this template use File | Settings | File Templates.
 */
(function populateTemplates(global, Handlebars) {
	"use strict";

	global.WM = global.WM || {};

	WM.templates = {
		altitudeDifferencesTr: Handlebars.compile("<tr><td>{{hAs}}</td><td>{{radius}}</td></tr>")
	};

}(this, Handlebars));