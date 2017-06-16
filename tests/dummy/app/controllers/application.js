import Ember from 'ember';
import moment from 'moment';

const { set } = Ember;

export default Ember.Controller.extend({
  dataMin: moment().subtract(1, 'year').valueOf(),
  dataMax: moment().subtract(1, 'day').valueOf(),
  dataMin2: moment().subtract(3, 'year').valueOf(),
  dataMax2: moment().subtract(1, 'year').valueOf(),
  dataMin3: moment().subtract(8, 'month').valueOf(),
  dataMax3: moment().subtract(2, 'month').valueOf(),
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
