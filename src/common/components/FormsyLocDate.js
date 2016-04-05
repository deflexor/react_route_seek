
import React from 'react';
import Formsy from 'formsy-react';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import { _setMuiComponentAndMaybeFocus } from 'formsy-material-ui/lib/utils';
import areIntlLocalesSupported from 'intl-locales-supported';

let DateTimeFormat;

// Use the native Intl if available
if (areIntlLocalesSupported('ru')) {
	DateTimeFormat = global.Intl.DateTimeFormat;
} else {
	const IntlPolyfill = require('intl');
	require('intl/locale-data/jsonp/ru');

	DateTimeFormat = IntlPolyfill.DateTimeFormat;
}

let FormsyDate = React.createClass({
	mixins: [ Formsy.Mixin ],

	propTypes: {
		name: React.PropTypes.string.isRequired
	},

	handleValueChange: function (event, value) {
		this.setValue(value);
		if (this.props.onChange) this.props.onChange(event, value);
	},

	_setMuiComponentAndMaybeFocus: _setMuiComponentAndMaybeFocus,

	render: function () {
		return (
			<DatePicker
				{...this.props}
				DateTimeFormat={DateTimeFormat}
				// Sets the default date format to be ISO8601 (YYYY-MM-DD), accounting for current timezone
				formatDate={(date) => (new Date(date.toDateString()+" 12:00:00 +0000")).toISOString().substring(0,10)}
				ref={this._setMuiComponentAndMaybeFocus}
				defaultValue={this.props.value}
				onChange={this.handleValueChange}
				errorText={this.getErrorMessage()}
				value={this.getValue()}
				wordings={{ok: 'OK', cancel: 'Отмена'}}
				firstDayOfWeek={1}
				locale="ru"
			/>
		);
	}
});

module.exports = FormsyDate;
