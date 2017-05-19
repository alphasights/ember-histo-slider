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
  intervalCount: null,
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

  rectXs: computed('x', 'bins', 'intervalCount', function(){
    let x = get(this, 'x');
    let bins = get(this, 'bins');

    return bins.map((bin) => x(bin.x0));
  }),

  rectHeights: computed('y', 'histogramHeight', 'bins', function(){
    let y = get(this, 'y');
    let histogramHeight = get(this, 'histogramHeight');
    let bins = get(this, 'bins');

    return bins.map((bin) => histogramHeight - y(bin.length));
  }),

  rectWidth: computed('x', 'bins', function(){
    let x = get(this, 'x');
    let bins = get(this, 'bins');

    return x(bins[0].x1) - x(bins[0].x0) - 1;
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
      let bins = get(this, 'bins');
      let currentBinIndex;

      if (value === get(this, 'dataMin')) {
        currentBinIndex = -1;
      } else {
        currentBinIndex = bins.findIndex((bin) => {
          return bin.x0 < value && value <= bin.x1;
        });
      }

      set(this, 'currentBinIndex', currentBinIndex);
    },

    setValue() {
      let currentBinIndex = get(this, 'currentBinIndex');
      let leftBound;
      if (currentBinIndex === -1) {
        leftBound = 0;
      } else {
        leftBound = get(this, 'bins')[currentBinIndex].x1;
      }
      let bounds = [leftBound, get(this, 'dataMax')]

      this.attrs.onSet(bounds);
    }
  },

  layout
});
