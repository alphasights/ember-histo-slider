import Ember from 'ember';

const { set } = Ember;

export default Ember.Controller.extend({
  setValue: null,
  actions: {
    onSet(value) {
      set(this, 'setValue', value);
    }
  }
})
