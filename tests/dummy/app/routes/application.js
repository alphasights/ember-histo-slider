import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    let data = [];
    for (var i=0;i<10;++i) data[i]=Math.random() * 70;
    return data;
  }
})
