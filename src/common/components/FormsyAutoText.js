import React from 'react';
import Formsy from 'formsy-react';
import AutoComplete from 'material-ui/lib/auto-complete';
import { _setMuiComponentAndMaybeFocus } from 'formsy-material-ui/lib/utils';

let FormsyAutoText = React.createClass({
  mixins: [ Formsy.Mixin ],

  propTypes: {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    onFocus: React.PropTypes.func,
    onBlur: React.PropTypes.func
  },

  handleChange: function handleChange(event) {
    if(this.getErrorMessage() != null){
      this.setValue(event.currentTarget.value);
      if (this.props.onChange) this.props.onChange(event, event.currentTarget.value);
    }
    else{
      if (this.isValidValue(event.target.value)) {
        this.setValue(event.target.value);
        if (this.props.onChange) this.props.onChange(event, event.target.value);
      }
      else{
        this.setState({
          _value: event.currentTarget.value,
          _isPristine: false
        });
        if (this.props.onChange) this.props.onChange(event, event.currentTarget.value);
      }
    }
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
      <AutoComplete
        {...this.props}
        ref={this._setMuiComponentAndMaybeFocus}
        defaultValue={this.props.value}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        onFocus={this.props.onFocus}
        onEnterKeyDown={this.handleEnterKeyDown}
        errorText={this.getErrorMessage()}
        value={this.getValue()}
        autoComplete="off" 
      />
    );
  }
});

module.exports = FormsyAutoText;
