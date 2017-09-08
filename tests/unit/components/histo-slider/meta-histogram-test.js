import { moduleForComponent, test, skip } from 'ember-qunit';

moduleForComponent('histo-slider/meta-histogram', 'Component | histo slider/meta histogram', {
  unit: true
});

test('Given metaData and a histogramHeight, calculates rectHeights', function(assert) {
  assert.expect(1);

  const component = this.subject();
  const height = 100;
  let metaData = [0,1,2,3,4,5];

  component.set('histogramHeight', height);
  component.set('metaData', metaData);

  assert.deepEqual(component.get('rectHeights'), [0,20,40,60,80,100])
});

skip('Given metaData, uniqueHistoSliderId and a histogramWidth, calculates rectWidth', function(assert){
  assert.expect(1);

  const component = this.subject();
  const metaData = [1,1,1,1];

  component.set('metaData', metaData);
  component.set('uniqueHistoSliderId', 'asdf');

  assert.equal(component.get('rectWidth'), 4);
});
