/* global describe, chai, it */
'use strict';
  var expect = chai.expect;

describe('EqList', function () {
  describe('Constructor', function () {
    it('Is defined', function () {
      /* jshint -W030 */
      expect(EqList).not.to.be.null;
      /* jshint +W030 */
    });
    it('Is instantiated', function () {
      var eqList = new EqList();
      expect(eqList).to.be.an.instanceof(EqList);
    });
  });
});
