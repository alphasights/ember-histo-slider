import Ember from 'ember';
import { v1 } from 'ember-uuid';
import layout from '../templates/components/histo-slider';

const { computed, get, set } = Ember;

export default Ember.Component.extend({
  classNames: ['ember-histo-slider'],
  classNameBindings: [
    'showHistoOnHover:ember-histo-slider--floating',
    'isSliding:ember-histo-slider--active'],

  currentBinIndex: null,
  data: null,
  intervalCount: computed.readOnly('metaData.length'),
  range: null,
  showHistoOnHover: null,
  isSliding: false,
  uniqueHistoSliderId: null,

  visibleModifier: computed('showHistoOnHover', 'isSliding', function(){
    return (get(this, 'showHistoOnHover') && get(this, 'isSliding'));
  }),

  dataMin: computed('range', function(){
    return get(this, 'range').min;
  }),

  dataMax: computed('range', function(){
    return get(this, 'range').max;
  }),

  init(){
    this._super(...arguments);

    set(this, 'uniqueHistoSliderId', `a${v1()}`);
  },

  uniqueHistoId: computed('uniqueHistoSliderId', function(){
    return `${get(this, 'uniqueHistoSliderId')}__histogram`;
  }),

  uniqueSliderId: computed('uniqueHistoSliderId', function(){
    return `${get(this, 'uniqueHistoSliderId')}__slider`;
  }),

  rangePercentages: computed('range', function(){
    return Object.keys(get(this, 'range')).map((percentage) => {
      if (percentage === 'min') {
        return 0.0;
      } else if (percentage === 'max') {
        return 100.0;
      } else {
        return parseFloat(percentage);
      }
    });
  }),

  rectValues: computed('intervalCount', 'range', 'rectPercentage', 'rangePercentages', function (){
    let intervalCount = get(this, 'intervalCount');
    let range = get(this, 'range');
    let rectPercentage = get(this, 'rectPercentage');
    let rangePercentages = get(this, 'rangePercentages');
    let rectValues = [];


    for (var i = 0; i < intervalCount; i++) {
      let intervalPercentage = i * rectPercentage;

      let upperRangePercentage = rangePercentages.find((percentage) => {
        return (percentage / 100.0) > intervalPercentage;
      });

      let lowerRangePercentage = rangePercentages[rangePercentages.indexOf(upperRangePercentage) - 1];

      let upperRangeValue = range[Object.keys(range)[rangePercentages.indexOf(upperRangePercentage)]];
      let lowerRangeValue = range[Object.keys(range)[rangePercentages.indexOf(upperRangePercentage) - 1]];

      let intervalRange = Math.abs(upperRangeValue - lowerRangeValue);
      let valuePercentage = (intervalPercentage - (lowerRangePercentage / 100)) / (Math.abs(upperRangePercentage - lowerRangePercentage) / 100);
      let valueRange = valuePercentage * intervalRange + lowerRangeValue;

      rectValues.push(valueRange);
    }

    rectValues.push(get(this, 'dataMax'));

    return rectValues;
  }),

  rectPercentage: computed('metaData.[]', function(){
    let data = get(this, 'metaData');

    if (data.length === 0) {
      return 0;
    }

    return (1.0 / data.length);
  }),

  start: computed('dataMin', 'dataMax', function() {
    let mean = (get(this, 'dataMin') + get(this, 'dataMax')) / 2;

    return mean;
  }),

  actions: {
    updateValue(value) {

      let valuePercentage = this._valuePercentage(value);

      let dataMin = get(this, 'dataMin');
      let currentBinIndex;
      if (value === dataMin) {
        currentBinIndex = -1;
      } else {
        currentBinIndex = Math.ceil(valuePercentage * get(this, 'intervalCount')) - 1;
      }

      set(this, 'currentBinIndex', currentBinIndex);

      let bounds = this._calculateBounds();

      this.attrs.onUpdate(bounds);
    },

    setValue() {
      let bounds = this._calculateBounds();

      this.attrs.onSet(bounds);
    }
  },

  _calculateBounds(){
    let currentBinIndex = get(this, 'currentBinIndex');
    let dataMin = get(this, 'dataMin');
    let leftBound;
    if (currentBinIndex === -1) {
      leftBound = dataMin;
    } else {
      leftBound = get(this, 'rectValues')[currentBinIndex + 1];
    }
    return [leftBound, get(this, 'dataMax')];
  },

  _valuePercentage(value) {
    let range = get(this, 'range');
    let rangeIntervals = Object.keys(range);

    let upperBoundInterval;

    if (value == get(this, 'dataMax')) {
      upperBoundInterval = 'max';
    } else {
      upperBoundInterval = rangeIntervals.find((interval) => { return range[interval] > value});
    }

    let lowerBoundInterval = rangeIntervals[rangeIntervals.indexOf(upperBoundInterval) - 1];

    let upperBound = range[upperBoundInterval];
    let lowerBound = range[lowerBoundInterval];

    let valueIntervalPercentage = Math.abs(value - lowerBound) / Math.abs(upperBound - lowerBound);

    let [lowerBoundPercentage, upperBoundPercentage] = [lowerBoundInterval, upperBoundInterval].map((interval) => {
      if (interval === 'min') {
        return 0.0;
      } else if (interval === 'max') {
        return 100.0;
      } else {
        return parseFloat(interval);
      }
    });

    return (valueIntervalPercentage * Math.abs(upperBoundPercentage - lowerBoundPercentage) + lowerBoundPercentage) / 100.0;
  },

  layout
});
