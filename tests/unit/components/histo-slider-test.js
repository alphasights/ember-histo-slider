import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('histo-slider', 'Component | histo slider', {
  unit: true
});

test('Generates unique ids for slider and histogram elements', function(assert) {
  assert.expect(2);

  const component = this.subject();

  assert.ok(component.get('uniqueHistoId').match(/a.{36}__histogram/));
  assert.ok(component.get('uniqueSliderId').match(/a.{36}__slider/));
});

test('Given a range, calculates dataMin, dataMax and rangePercentages', function(assert){
  assert.expect(3);

  const component = this.subject();
  const range = {
    min: 10,
    '27%': 15,
    '50%': 20,
    '79%': 20,
    max: 40
  }

  component.set('range', range);
  assert.equal(component.get('dataMin'), 10);
  assert.equal(component.get('dataMax'), 40);
  assert.deepEqual(component.get('rangePercentages'), [0.0, 27.0, 50.0, 79.0, 100.0]);
});

test('Given metaData and range, calculates rectValues', function(assert){
  assert.expect(2);

  const component = this.subject();
  let range = {
    min: 10,
    max: 20
  };

  component.set('range', range);
  component.set('metaData', [1,2,3,4,5]);

  assert.deepEqual(component.get('rectValues'), [10, 12, 14, 16, 18, 20]);

  range = {
    min: -100,
    '25%': 0,
    '50%': 200,
    '75%': 250,
    max: 500
  };

  component.set('range', range);
  component.set('metaData', [1,2,3,4,5,6,7,8]);
  assert.deepEqual(component.get('rectValues'), [-100, -50, 0, 100, 200, 225, 250, 375, 500]);
});

test('Given metaData, calculates rectPercentage', function(assert){
  assert.expect(2);

  const component = this.subject();
  let metaData = [];

  component.set('metaData', metaData);

  assert.equal(component.get('rectPercentage'), 0);

  metaData = [1,2,3,4];

  component.set('metaData', metaData);

  assert.equal(component.get('rectPercentage'), 0.25);
});

test('Given a range, sets the start as the mean of that range', function(assert) {
  assert.expect(1);

  const component = this.subject();
  const range = {
    min: -2,
    max: 0
  };
  component.set('range', range);

  assert.equal(component.get('start'), -1);
});

test('Given metaData, calculates intervalCount', function(assert){
  assert.expect(1);

  const component = this.subject();

  component.set('metaData', [1, 1, 1]);

  assert.equal(component.get('intervalCount'), 3);
});

test('Given metaData.length and a range, calculates rectValues', function(assert){
  assert.expect(1);

  const component = this.subject();
  const range = {
    min: 10,
    '50%': 20,
    max: 40
  }

  component.set('metaData', [1, 1]);
  component.set('range', range);

  assert.deepEqual(component.get('rectValues'), [10, 20, 40]);

});

test('rectValues calculates correctly when range starts at 0', function(assert){
  assert.expect(1);

  const component = this.subject();

  const range = {
    min: 0,
    max: 200
  }

  component.set('metaData', [1, 1]);
  component.set('range', range)

  assert.deepEqual(component.get('rectValues'), [0, 100, 200]);
});

test('rectValues calculates correctly even with a negative value range', function(assert){
  assert.expect(1);

  const component = this.subject();

  const range = {
    min: -100,
    max: 200
  }
  component.set('metaData', [1, 1]);
  component.set('range', range)

  assert.deepEqual(component.get('rectValues'), [-100, 50, 200]);
});


/*
actions!
*/
