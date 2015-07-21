/* global before, chai, describe, it */
'use strict';


var EqList = require('listwidget/EqList'),
    PolygonList = require('listwidget/PolygonList');


var expect = chai.expect;

describe('PolygonList', function () {
  describe('Constructor', function () {
    it('Is defined', function () {
      /* jshint -W030 */
      expect(PolygonList).not.to.be.null;
      /* jshint +W030 */
    });
  });

  describe('includeEvent', function () {
    it('always returns true when no polygon is specified', function () {
      var plist;

      plist = PolygonList({
        container: document.querySelector('#list'),
        feed: EqList.M25_URL_DAY
      });

      expect(plist.includeEvent()).to.equal(true);
      expect(plist.includeEvent(null)).to.equal(true);
      expect(plist.includeEvent([])).to.equal(true);
      expect(plist.includeEvent({})).to.equal(true);
      expect(plist.includeEvent({
        geometry: {
          coordinates: [0.0, 0.0]
        }})).to.equal(true);
    });
  });

  describe('contains', function () {
    var plist,
        polygon;

    before(function () {
      polygon = [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0]
      ];

      plist = PolygonList({
        container: document.querySelector('#list'),
        feed: EqList.M25_URL_DAY
      });
    });

    it('works for interior points', function () {
      expect(plist.contains(polygon, 0.5, 0.5)).to.equal(true);
    });

    it('works for external points', function () {
      expect(plist.contains(polygon, 3.0, 3.0)).to.equal(false);
    });

    // it('works for edge points', function () {
    //   expect(plist.contains(polygon, 0.0, 0.5)).to.equal(true);
    //   expect(plist.contains(polygon, 0.5, 1.0)).to.equal(true);
    //   expect(plist.contains(polygon, 1.0, 0.5)).to.equal(true);
    //   expect(plist.contains(polygon, 0.5, 0.0)).to.equal(true);
    // });

    // it('works for verticies', function () {
    //   expect(plist.contains(polygon, 0.0, 0.0)).to.equal(true);
    //   expect(plist.contains(polygon, 0.0, 1.0)).to.equal(true);
    //   expect(plist.contains(polygon, 1.0, 1.0)).to.equal(true);
    //   expect(plist.contains(polygon, 1.0, 0.0)).to.equal(true);
    // });
  });
});
