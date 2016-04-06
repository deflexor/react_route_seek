import React from 'react';
import Formsy from 'formsy-react';
import TextField from 'material-ui/lib/text-field';
import { _setMuiComponentAndMaybeFocus } from 'formsy-material-ui/lib/utils';

let FormsyTextLight = React.createClass({
    mixins: [ Formsy.Mixin ],

    propTypes: {
        name: React.PropTypes.string.isRequired,
        value: React.PropTypes.string,
        onFocus: React.PropTypes.func,
        onBlur: React.PropTypes.func
    },

    handleChange: function handleChange(event) {
        this.setValue(event.target.value);
    },

    handleBlur: function handleBlur(event) {
        this.setValue(event.currentTarget.value);
        if (this.props.onBlur) this.props.onBlur(event);
    },

    handleEnterKeyDown: function handleEnterKeyDown(event) {
        this.setValue(event.currentTarget.value);
        if (this.props.onEnterKeyDown) this.props.onEnterKeyDown(event, event.currentTarget.value);
    },

    _setMuiComponentAndMaybeFocus: _setMuiComponentAndMaybeFocus,

    render: function () {
        return (
            <TextField
                {...this.props}
                ref={this._setMuiComponentAndMaybeFocus}
                defaultValue={this.props.value}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                onFocus={this.props.onFocus}
                onEnterKeyDown={this.handleEnterKeyDown}
                errorText={this.getErrorMessage()}
                value={this.getValue()}
            />
        );
    }
});

module.exports = FormsyTextLight;
