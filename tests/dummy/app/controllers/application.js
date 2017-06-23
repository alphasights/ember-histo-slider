import Ember from 'ember';
import moment from 'moment';

const { get, set } = Ember;

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

  dateFormat: "MMM Do YYYY",

  _formatTime(ms){
    return moment(ms).format(get(this, 'dateFormat'));
  },

  setValue: null,
  setValue2: null,
  actions: {
    onSet(value) {
      set(this, 'setValue', [this._formatTime(value[0]), this._formatTime(value[1])]);
    },

    onSet2(value) {
      set(this, 'setValue2', [this._formatTime(value[0]), this._formatTime(value[1])]);
    },

    onSet3(value) {
      set(this, 'setValue3', [this._formatTime(value[0]), this._formatTime(value[1])]);
    },

    onUpdate(value) {
      set(this, 'updateValue', [this._formatTime(value[0]), this._formatTime(value[1])]);
    },

    onUpdate2(value) {
      set(this, 'updateValue2', [this._formatTime(value[0]), this._formatTime(value[1])]);
    },

    onUpdate3(value) {
      set(this, 'updateValue3', [this._formatTime(value[0]), this._formatTime(value[1])]);
    },
  }
})
