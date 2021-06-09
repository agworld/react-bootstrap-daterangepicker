'use strict';
/**
 * react-bootstrap-daterangepicker.js
 *
 * A slightly modified version of bootstrap-daterangepicker.js for use in react and npm.
 * Original copyright in: ./lib/daterangepicker.js
 */
var React = require('react');
var $ = require('jquery');
var objectAssign = require('object-assign');
require('./daterangepicker.js');
var getOptions = require('./get-options.js');

/* this is our export React class */
class ReactBootstrapDateRangePicker extends React.Component {
	constructor(props) {
		super(props)
		this.$picker = null
		this.options = getOptions()
	}

	makeEventHandler(eventType) {
		return function (event, picker) {
			if (typeof this.props.onEvent === 'function') {
				this.props.onEvent(event, picker);
			}
			if (typeof this.props[eventType] === 'function') {
				this.props[eventType](event, picker);
			}
		}.bind(this);
	}

	getOptionsFromProps() {
		var options, props = this.props;
		this.options.forEach(function (option) {
			if (props.hasOwnProperty(option)) {
				options = options || {};
				options[option] = props[option];
			}
		});
		return options || {};
	}

	setOptionsFromProps() {
		var currentOptions = this.getOptionsFromProps();
		var keys = Object.keys(currentOptions);
		var $this = this;
		if ($this.$picker) {
			if (currentOptions) {
				keys.forEach(function (key) {
					$this.$picker.data('daterangepicker')[key] = currentOptions[key];
				});
			}
		}
	}

	componentDidMount() {
		this.initializeDateRangePicker();
	}

	componentWillUnmount() {
		this.removeDateRangePicker();
	}

	removeDateRangePicker() {
		this.$picker.data('daterangepicker').remove();
	}

	initializeDateRangePicker() {
		var $this = this;
		$ = (window.jQuery && window.jQuery.fn.daterangepicker) ? window.jQuery : $;
		$this.$picker = $(this.refs.picker);
		// initialize
		$this.$picker.daterangepicker(this.getOptionsFromProps());
		// attach event listeners
		['Show', 'Hide', 'ShowCalendar', 'HideCalendar', 'Apply', 'Cancel'].forEach(function (event) {
			var lcase = event.toLowerCase();
			$this.$picker.on(lcase + '.daterangepicker', $this.makeEventHandler('on' + event));
		});
	}

	render() {
		this.setOptionsFromProps();
		return React.createElement(
			'div',
			objectAssign({ ref: 'picker' }, this.props),
			this.props.children
		);
	}
}

module.exports = ReactBootstrapDateRangePicker
