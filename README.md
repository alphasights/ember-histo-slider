# Ember-histo-slider


This package provides a component `{{histo-slider}}` that lays a histogram on top of a slider that the user can manipulate. The slider is provided by [ember-cli-nouislider](https://github.com/kennethkalmer/ember-cli-nouislider).


### Installation

```
ember install ember-histo-slider
```

### Usage

Basic usage of this component is as such:

```hbs
{{histo-slider
	metaData=metaData
	range=range
	onSet=(action "setValue")
	onUpdate=(action "updateValue")}}
```

The component can also be passed a block that embeds the yielded content within itself, which may be helpful for styling:

```hbs
{{#histo-slider
	metaData=metaData
	range=range
	onSet=(action "setValue")
	onUpdate=(action "updateValue")}}
	
	<div class="set-value">{{setValue}}</div>
	<div class="update-value">{{updatedValue}}</div>
{{/histo-slider
```

Currently, this component requires four properties: `metaData`, `range`, `onSet` and `onUpdate`. This package is still being developed and may be changed in the future.

### Configuration

#### `metaData`

`metaData` is an array of values that represents each bar in the histogram.

The values of this array combined with the length of the array will almost entirely shape the form of the histogram. (The other relevant property is `histogramHeight` to determine the height of the entire histogram, but not its contents.)

#### `range`

`range` is an object that describes the domain of the histo-slider.

Consider a histo-slider that displays values from 0 to 100. The `range` object would be configured as:

```js
{
	'min': 0,
	'max': 100
}
```

The domain represented by `range` does not have to be linear. One can set intermediate values and scale the domain as you please:

```js
{
	'min': -100,
	'25%': 50,
	'50%': 250,
	'max': 750
}
```

### `showHistoOnHover`

`showHistoOnHover` is a boolean (default: false) which, when true, will only render the histogram when the user is sliding the slider. 

It renders above the slider using `position: absolute` so the slider will appear over any elements that are above the slider, if applicable.

### Actions

There are currently two actions `onUpdate` and `onSet`. Both of these actions are invoked in response to user actions. The histo-slider will return an array of length two that contains the start and end value of the selected part of the slider. 

### `onUpdate`

The `onUpdate` action will fire whenever the user moves the slider.

### `onSet`

The `onSet` action will fire whenever the user _releases_ the slider.

#### Example:

```js
onUpdate(values){
	set(this, 'updateText', `Change Selection to ${values[0]} - ${values[1]}?`}
},

onSet(values){
	set(this, 'setText', `Current Selection: ${values[0]} - ${values[1]}`);
}
```

