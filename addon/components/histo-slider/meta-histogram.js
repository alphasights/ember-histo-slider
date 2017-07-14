import Ember from 'ember';
import { select } from 'd3-selection';
import layout from '../../templates/components/histo-slider/meta-histogram';

const { get, computed } = Ember;

export default Ember.Component.extend({
  tagName: 'svg',
  classNames: ['ember-histo-slider__histogram'],
  classNameBindings: ['uniqueHistoId'],

  metaData: null,

  data: computed.alias('metaData'),

  uniqueHistoSliderId: null,

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

  histogramHeight: 80,

  rectHeights: computed('data', 'histogramHeight', function(){
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

  layout
});
