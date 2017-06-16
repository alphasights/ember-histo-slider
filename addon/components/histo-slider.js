import Ember from 'ember';
import { histogram, max } from 'd3-array';
import { axisBottom } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { v1 } from 'ember-uuid';
import layout from '../templates/components/histo-slider';

const { computed, get, set, String } = Ember;

export default Ember.Component.extend({
  classNames: ['ember-histo-slider'],

  axisTicks: null,
  curtain: null,
  currentBinIndex: null,
  data: null,
  dataMax: null,
  dataMin: null,
  intervalCount: computed.readOnly('data.length'),
  dataInterval: computed('dataMin', 'dataMax', 'data.[]', function(){
    let dataMin = get(this, 'dataMin');
    let dataMax = get(this, 'dataMax');
    let data = get(this, 'data');

    return (dataMax - dataMin) / data.length;
  }),
  margin: {top: 10, right: 30, bottom: 30, left: 30},
  setValue: null,
  value: null,
  uniqueHistoSliderId: null,

  init(){
    this._super(...arguments);

    set(this, 'uniqueHistoSliderId', `a${v1()}`);
  },

  bins: computed('x', 'data', 'intervalCount', function() {
    let x = get(this, 'x');
    let data = get(this, 'data');
    return histogram()
        .domain(x.domain())
        .thresholds(get(this, 'intervalCount'))(data);
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

  startValue: computed('dataMin', 'dataMax', function() {
    let min = (get(this, 'dataMin') + get(this, 'dataMax')) / 2;
    return [min, get(this, 'dataMax')];
  }),

  svg: computed(function() {
    let id = get(this, 'uniqueHistoSliderId');
    return select(`.${id}`);
  }).volatile(),

  svgWidth: computed('svg', function(){
    return get(this, 'svg').property('clientWidth');
  }),

  svgHeight: computed('svg', function(){
    return get(this, 'svg').property('clientHeight');
  }),

  x: computed('histogramWidth', function() {
    let max = get(this, 'dataMax');
    let min = get(this, 'dataMin');
    return scaleLinear().domain([min, max]).rangeRound([0, get(this, 'histogramWidth')]);
  }),

  y: computed('histogramHeight', function() {
    return scaleLinear().domain([0, max(get(this, 'bins'), function(d) { return d.length; })])
        .range([get(this, 'histogramHeight'), 0]);
  }),

  didInsertElement: function(){
    this.draw();
  },

  draw(){
    let svg = get(this, 'svg'),
        ticks = get(this, 'axisTicks'),
        margin = get(this, 'margin'),
        height = get(this, 'histogramHeight'),
        x = get(this, 'x'),
        g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(axisBottom(x).ticks(ticks));
  },

  actions: {
    updateValue(value) {
      let currentBinIndex;
      let dataMax = get(this, 'dataMax');
      let dataMin = get(this, 'dataMin');
      if (value === dataMin) {
        currentBinIndex = -1;
      } else {
        let relativeValue = Math.abs(value - dataMin);
        let domain = Math.abs(dataMax - dataMin);
        currentBinIndex = Math.ceil(relativeValue/domain * get(this, 'intervalCount')) - 1;
      }

      set(this, 'currentBinIndex', currentBinIndex);
    },

    setValue(value) {
      let currentBinIndex = get(this, 'currentBinIndex');
      let dataMin = get(this, 'dataMin');
      let dataMax = get(this, 'dataMax');
      let leftBound;
      if (currentBinIndex === -1) {
        leftBound = dataMin;
      } else {
        let relativeValue = Math.abs(value - dataMin);
        let domain = Math.abs(dataMax - dataMin);
        leftBound = Math.ceil(relativeValue/domain * get(this, 'intervalCount')) * get(this, 'dataInterval') + dataMin;
      }
      let bounds = [leftBound, get(this, 'dataMax')]

      this.attrs.onSet(bounds);
    }
  },

  layout
});
