import Ember from 'ember';
import { histogram, max } from 'd3-array';
import { axisBottom } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import layout from '../templates/components/histo-slider';

const { computed, get, set } = Ember;

export default Ember.Component.extend({
  svgWidth: '960',
  svgHeight: '500',
  curtain: null,
  data: null,
  value: null,
  setValue: null,
  startValue: computed('dataMin', 'dataMax', function() {
    return (get(this, 'dataMin') + get(this, 'dataMax')) / 2
  }),

  svg: computed(function() {
    return select('.ember-histo');
  }).volatile(),

  margin: {top: 10, right: 30, bottom: 30, left: 30},

  histogramWidth: computed('svgWidth', 'margin', function() {
    let svgWidth = get(this, 'svgWidth');
    let margin = get(this, 'margin');
    return svgWidth - margin.left - margin.right;
  }),

  histogramHeight: computed('svgHeight', 'margin', function() {
    let svgHeight = get(this, 'svgHeight');
    let margin = get(this, 'margin');

    return svgHeight - margin.top - margin.bottom;
  }),

  ticksCount: 20,

  dataMin: computed('data', function() {
    return 0;
  }),

  dataMax: computed('data', function() {
    return 70000;
  }),

  bins: computed('x', 'data', 'tickThreshold', function() {
    let x = get(this, 'x');
    let data = get(this, 'data');
    return histogram()
        .domain(x.domain())
        .thresholds(get(this, 'ticksCount'))(data);
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


  draw: function(){
    let svg = get(this, 'svg'),
        margin = get(this, 'margin'),
        height = get(this, 'histogramHeight'),
        x = get(this, 'x'),
        y = get(this, 'y'),
        bins = get(this, 'bins'),
        g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      let curtain = svg.append('rect')
          .attr('x', margin.left)
          .attr('y', 0)
          .attr('height', svg.attr('height') - margin.bottom)
          .attr('width', this._calculateCurtainWidth(get(this, 'startValue')))
          .style('fill', 'gray')
          .style('fill-opacity', '.5');

    set(this, 'curtain', curtain);
    let bar = g.selectAll('.bar')
      .data(bins)
      .enter().append('g')
        .attr('class', 'bar')
        .attr('transform', function(d) { return 'translate(' + x(d.x0) + ',' + y(d.length) + ')'; });

    bar.append('rect')
        .attr('x', 1)
        .attr('width', x(bins[0].x1) - x(bins[0].x0) - 1)
        .attr('height', function(d) { return height - y(d.length); });

    bar.append('text')
        .attr('dy', '.75em')
        .attr('y', 6)
        .attr('x', (x(bins[0].x1) - x(bins[0].x0)) / 2)
        .attr('text-anchor', 'middle');

    g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(axisBottom(x));
  },

  didInsertElement: function(){
    this.draw();
  },

  _calculateCurtainWidth(value) {
    let histogramWidth = get(this, 'histogramWidth');
    return Math.floor(value * histogramWidth);
  },

  currentBinIndex: null,

  actions: {
    updateValue(value) {
      set(this, 'value', value);
      let bins = get(this, 'bins');
      let currentBinIndex = bins.findIndex((bin) => {
        return bin.x0 < value && value <= bin.x1;
      });

      set(this, 'currentBinIndex', currentBinIndex)

      let currentBinRatio = (currentBinIndex + 1) / bins.length;
      let curtain = get(this, 'curtain');
      curtain.attr('width', this._calculateCurtainWidth(currentBinRatio));
    },

    setValue() {
      let bins = get(this, 'bins')
      let currentBinIndex = get(this, 'currentBinIndex');
      this.attrs.onSet([bins[currentBinIndex].x1, get(this, 'dataMax')]);
    }
  },
  layout
});
