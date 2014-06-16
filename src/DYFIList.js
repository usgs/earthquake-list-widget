/* global define */
define([
	'./EqList'
], function (
	EqList
) {
	'use strict';

	var DYFIList = function () {
		EqList.apply(this, arguments);
	};
	DYFIList.prototype = Object.create(EqList.prototype);

	DYFIList.prototype._getClassName = function () {
		return 'DYFIList';
	};

	DYFIList.prototype._includeEvent = function (e) {
		return (e.properties.types.indexOf('dyfi') !== -1);
	};


	DYFIList.prototype._getEventValue = function (e) {
		var romanCdi = this._decToRoman(e.properties.cdi);

		return '<span class="roman mmi' + romanCdi + '">' + romanCdi + '</span>';
	};

	DYFIList.prototype._getEventTitle = function (e) {
		return e.properties.title;
	};

	DYFIList.prototype._getEventAside = function (e) {
		return (e.properties.felt||0) + ' responses';
	};

	return DYFIList;
});