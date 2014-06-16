/* global define */
define([
	'./EqList'
], function (
	EqList
) {
	'use strict';

	var PAGERList = function () {
		EqList.apply(this, arguments);
	};
	PAGERList.prototype = Object.create(EqList.prototype);

	PAGERList.prototype._getClassName = function () {
		return 'PAGERList';
	};

	PAGERList.prototype._includeEvent = function (e) {
		return (e.properties.types.indexOf('losspager') !== -1);
	};


	PAGERList.prototype._getEventValue = function (e) {
		return '<span class="pager-alertlevel-' + e.properties.alert + '">' +
				e.properties.alert[0].toUpperCase() + e.properties.alert.slice(1) +
				'</span>';
	};

	PAGERList.prototype._getEventTitle = function (e) {
		return e.properties.title;
	};

	PAGERList.prototype._getEventAside = function (e) {
		var romanMMI = this._decToRoman(e.properties.mmi);

		return 'Max Intensity: <span class="mmi' + romanMMI + '">' +
				romanMMI + '</span>';
	};

	return PAGERList;
});