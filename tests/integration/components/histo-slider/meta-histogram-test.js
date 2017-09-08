import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('histo-slider/meta-histogram', 'Integration | Component | histo slider/meta histogram', {
  integration: true
});

test('it renders two rects for every metaDatum', function(assert) {
  this.set('metaData', [1,2,3]);
  this.render(hbs`{{histo-slider/meta-histogram metaData=metaData}}`);

  assert.equal(this.$('rect').length, 6);
});

test('For each metaData, a rect with proportional height to the histogram height is rendered', function(assert) {
  assert.expect(1);

  this.set('metaData', [1,2,3,4]);
  this.set('histogramHeight',100);
  this.render(hbs`{{histo-slider/meta-histogram metaData=metaData histogramHeight=histogramHeight}}`);

  const histoRects = this.$('.ember-histo-slider__rect').toArray();
  const rectHeights = [25, 50, 75, 100];

  assert.deepEqual(histoRects.map((rect) => parseFloat(rect.getAttribute('height'))), rectHeights);
});

test('Given a metaData count that does not divide evenly into integers, still divides proportionally', function(assert) {
  assert.expect(1);

  this.set('metaData', [1,2,3]);
  this.set('histogramHeight',100);
  this.render(hbs`{{histo-slider/meta-histogram metaData=metaData histogramHeight=histogramHeight}}`);

  const histoRects = this.$('.ember-histo-slider__rect').toArray();
  const rectHeights = [
    (1/3) * 100,
    (2/3) * 100,
    100
  ];

  assert.deepEqual(histoRects.map((rect) => parseFloat(rect.getAttribute('height'))), rectHeights);
});

test('Given a currentBinIndex, applies an --excluded modifier to all rects whose index is greater than or equal to the given value', function(assert) {
  assert.expect(1);

  this.set('metaData', [1,2,3,4]);
  this.set('currentBinIndex', 2);
  this.render(hbs`{{histo-slider/meta-histogram metaData=metaData currentBinIndex=currentBinIndex}}`);

  const excludedRects = this.$('.ember-histo-slider__rect--excluded').toArray();

  assert.deepEqual(excludedRects.length, 3);
});
