/* global describe, chai, it */
'use strict';
  var expect = chai.expect;
  var EqList = require('listwidget/EqList');

describe('EqList', function () {
  describe('Constructor', function () {
    it('Is defined', function () {
      /* jshint -W030 */
      expect(EqList).not.to.be.null;
      /* jshint +W030 */
    });
  });
});
