import Ember from 'ember';

const { set } = Ember;

export default Ember.Controller.extend({
  setValue: null,
  setValue2: null,
  actions: {
    onSet(value) {
      set(this, 'setValue', value);
    },

    onSet2(value) {
      set(this, 'setValue2', value);
    },
  }
})
