import Ember from 'ember';
import { select } from 'd3-selection';
import layout from '../../templates/components/histo-slider/meta-histogram';
import { axisLeft } from 'd3-axis';
import { scaleLinear } from 'd3-scale';

const { get, computed } = Ember;

export default Ember.Component.extend({
  tagName: 'svg',
  attributeBindings: ['height'],
  classNames: ['ember-histo-slider__svg'],
  classNameBindings: ['uniqueHistoId'],

  metaData: null,

  data: computed.alias('metaData'),

  uniqueHistoSliderId: null,
  histogramHeight: null,

  height: computed('histogramHeight', function(){
    return get(this, 'histogramHeight');
  }),

  uniqueHistoId: computed('uniqueHistoSliderId', function(){
    return `${get(this, 'uniqueHistoSliderId')}__histogram`;
  }),

  svg: computed(function() {
    let id = get(this, 'uniqueHistoId');
    return select(`.${id}`);
  }).volatile(),

  histogramWidth: computed('svg', function(){
    return get(this, 'svg').property('clientWidth');
  }),

  rectHeights: computed('data', 'height', function(){
    let data = get(this, 'data');
    let height = get(this, 'height');
    let dataMax = Math.max(...data);
    let heights = [];

    if (dataMax == 0) {
      return Array(data.length).fill(0);
    }

    data.forEach((datum) => {
      heights.push((datum / dataMax) * height);
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

  histoTransformX: computed('histogramWidth', function(){
    return get(this, 'histogramWidth') * 0.1 + 1;
  }),

  scaleLinear: computed('data', function() {
    let data = get(this, 'data');
    let dataMax = Math.max(...data);

    return scaleLinear().domain([0, dataMax]).range([get(this, 'histogramHeight'), 0]);
  }),

  didRender() {
    this._super(...arguments);

    let scaleLinear = get(this, 'scaleLinear');
    let svg = get(this, 'svg');
    let histoTransformX = get(this, 'histoTransformX');
    let histogramWidth = get(this, 'histogramWidth');

    svg.selectAll('.ember-histo-slider__axis').remove();

    let axis = svg.insert('g', ':first-child').attr('class', 'ember-histo-slider__axis').attr('transform', `translate(${histogramWidth -1}, 0) scale(1,0.9)`).call(axisLeft(scaleLinear).tickSize(histogramWidth - histoTransformX).ticks(3));

    axis.selectAll('path').attr('opacity', '0');
  },

  layout
});
