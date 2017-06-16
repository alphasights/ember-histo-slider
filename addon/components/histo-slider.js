import Ember from 'ember';
import { select } from 'd3-selection';
import { v1 } from 'ember-uuid';
import layout from '../templates/components/histo-slider';
import moment from 'moment';

const { computed, get, set, String } = Ember;

export default Ember.Component.extend({
  classNames: ['ember-histo-slider'],

  curtain: null,
  currentBinIndex: null,
  data: null,
  dateFormat: "MMM Do YYYY",
  intervalCount: computed.readOnly('data.length'),
  margin: {top: 10, right: 30, bottom: 10, left: 30},
  setValue: null,
  range: null,
  value: null,
  uniqueHistoSliderId: null,


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

  histoStyle: computed('histogramWidth', 'margin', function(){
    return String.htmlSafe(`width: ${get(this, 'histogramWidth')}px; margin-left: ${get(this, 'margin').left}px;`);
  }),

  histogramHeight: computed('svgHeight', 'margin', function() {
    let svgHeight = get(this, 'svgHeight');
    let margin = get(this, 'margin');

    return svgHeight - margin.top - margin.bottom;
  }),

  histogramWidth: computed('svgWidth', 'margin', function() {
    let svgWidth = get(this, 'svgWidth');
    let margin = get(this, 'margin');

    return svgWidth - margin.left - margin.right;
  }),

  rectXs: computed('data', 'rectWidth', function(){
    let data = get(this, 'data');
    let rectWidth = get(this, 'rectWidth');

    if (data.length === 0) {
      return 0;
    }
    let xArray = [];
    data.forEach((_, index) => {
      xArray.push(rectWidth * index);
    });

    return xArray;
  }),

  rectHeights: computed('data', 'histogramHeight', 'bins', function(){
    let data = get(this, 'data');
    let histogramHeight = get(this, 'histogramHeight');
    let dataMax = Math.max(...data);
    let heights = [];
    data.forEach((datum) => {
      heights.push((datum / dataMax) * histogramHeight);
    });
    return heights;
  }),

  rectWidth: computed('histogramWidth', 'data.[]', function(){
    let histogramWidth = get(this, 'histogramWidth');
    let data = get(this, 'data');

    if (data.length === 0) {
      return 0;
    }

    return (histogramWidth / data.length);
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

  rectPercentage: computed('data.[]', function(){
    let data = get(this, 'data');

    if (data.length === 0) {
      return 0;
    }

    return (1.0 / data.length);
  }),

  startValue: computed('dataMin', 'dataMax', function() {
    let min = (get(this, 'dataMin') + get(this, 'dataMax')) / 2;
    return [min, get(this, 'dataMax')];
  }),

  svg: computed(function() {
    let id = get(this, 'uniqueHistoId');
    return select(`.${id}`);
  }).volatile(),

  svgWidth: computed('svg', function(){
    return get(this, 'svg').property('clientWidth');
  }),

  svgHeight: computed('svg', function(){
    return get(this, 'svg').property('clientHeight');
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

  _formatTime(ms){
    return moment(ms).format(get(this, 'dateFormat'));
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
    return [this._formatTime(leftBound), this._formatTime(get(this, 'dataMax'))];
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
