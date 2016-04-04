import React from 'react';

import AutoComplete from 'material-ui/lib/auto-complete';
import RaisedButton from 'material-ui/lib/raised-button';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import MenuItem from 'material-ui/lib/menus/menu-item';

import FMUI from 'formsy-material-ui';
const { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup, FormsySelect, FormsyText, FormsyTime, FormsyToggle } = FMUI;
import FormsyAutoText from './FormsyAutoText';

import fetch from 'isomorphic-fetch';

import styles from './order_form.css';

const ErrorMessages = {
    wordsError: "Please only use letters"
};

const AddressInput = React.createClass({
    getInitialState() {
        return {
            dataSource: []
        };
    },
    handleNewRequest(t, i) {
        if(this.props.handleAddressSelect)
            this.props.handleAddressSelect(this.state.dataSource[i]);
    },
    handleUpdateInput(t) {
        if(t.length < 3) return;
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': t }, (results, status) => {
            const ds = (status == google.maps.GeocoderStatus.OK) ? results : [];
            if(ds.length > 8) ds.splice(8);
            this.setState({
                dataSource: ds
            });
        });
    },
    render() {
        return (
            <FormsyAutoText {...this.props}
                            dataSource={this.state.dataSource.map((r) => r.formatted_address)}
                            onUpdateInput={this.handleUpdateInput}
                            onNewRequest={this.handleNewRequest}
                            filter={AutoComplete.caseInsensitiveFilter} />
        );
    }
});

const AddressGroupInput = React.createClass({
    render() {
        return (
            <div>
              <AddressInput {...this.props} />
            </div>
        );
    }
});

const OrderForm = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            users: []
        };
    },
    componentDidMount() {
        this.serverRequest = fetch('/api/users.json').then((r) => r.json()).then((j) => {
            this.setState({
                users: j.results
            });
        });
    },

    render() {
        const {wordsError} = ErrorMessages;
        
        return (
            <Card className={styles.card}>
              <CardTitle title="Добавление заказа" subtitle="данные о заказе" />
              <CardText>
                <Formsy.Form
                   onValid={this.enableButton}
                   onInvalid={this.disableButton}
                   onValidSubmit={this.submitForm}
                   >
                  <AddressGroupInput
                     name="address_from"
                     handleAddressSelect={this.props.handleAddress1Select}
                     validations="isWords"
                     validationError={wordsError}
                     required
                     hintText="Россия, Москва, Тверская, 1"
                     floatingLabelText="Адрес (откуда)"
                     />
                  <AddressGroupInput
                     name="address_from"
                     handleAddressSelect={this.props.handleAddress2Select}
                     validations="isWords"
                     validationError={wordsError}
                     required
                     hintText="Россия, Москва, Тверская, 2"
                     floatingLabelText="Адрес доставки (куда)"
                     />
                  <FormsySelect
                     name="broker"
                     required
                     floatingLabelText="Ответственное лицо (брокер)">
                    {this.state.users.map( (i) => <MenuItem key={i.id} value={i.id} primaryText={`${i.email} ${i.first_name}`} /> )}
                  </FormsySelect><br/>
                  <FormsyToggle
                     name="toggle"
                     label="Toggle" />
                </Formsy.Form>
              </CardText>
              <CardActions>
                <RaisedButton label="Сохранить" primary={true} className={styles.but} />
                <RaisedButton label="Очистить" secondary={true} className={styles.but} />
              </CardActions>
            </Card>
        );
    }
});

export default OrderForm;
