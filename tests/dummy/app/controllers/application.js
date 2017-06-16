import Ember from 'ember';
import moment from 'moment';

const { set } = Ember;

export default Ember.Controller.extend({
  range: {
    'min': moment().subtract(1, 'year').valueOf(),
    '25%': moment().subtract(6, 'month').valueOf(),
    '75%': moment().subtract(1, 'month').valueOf(),
    'max': moment().subtract(1, 'day').valueOf(),
  },

  range2: {
    'min': moment().subtract(3, 'year').valueOf(),
    '50%': moment().subtract(6, 'month').valueOf(),
    'max': moment().subtract(1, 'day').valueOf(),
  },

  range3: {
    'min': moment().subtract(1, 'year').valueOf(),
    '25%': moment().subtract(6, 'month').valueOf(),
    '75%': moment().subtract(1, 'month').valueOf(),
    'max': moment().subtract(1, 'day').valueOf(),
  },

  setValue: null,
  setValue2: null,
  actions: {
    onSet(value) {
      set(this, 'setValue', value);
    },

    onSet2(value) {
      set(this, 'setValue2', value);
    },

    onSet3(value) {
      set(this, 'setValue3', value);
    },

    onUpdate(value) {
      set(this, 'updateValue', value);
    },

    onUpdate2(value) {
      set(this, 'updateValue2', value);
    },

    onUpdate3(value) {
      set(this, 'updateValue3', value);
    },
  }
})
