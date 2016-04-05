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

import {normalizePlaces} from '../../utils.js';

const ErrorMessages = {
    wordsError: "Please only use letters"
};

const acService = new google.maps.places.AutocompleteService();

const AddressInput = React.createClass({
    getInitialState() {
        return {
            dataSource: [],
			selected: null
        };
    },
    handleNewRequest(t, i) {
        if(this.props.onAddressSelect) {
            this.props.onAddressSelect(this.state.dataSource[i]);
			this.setState({ selected: i });
		}
    },
    handleUpdateInput(t) {
        if(t.length < 2) return;
		acService.getQueryPredictions({ input: t }, (results, status) => {
			// only use: place_id, description
            const ds = (status == google.maps.places.PlacesServiceStatus.OK) ? results.filter((r) => r.place_id) : [];
            if(ds.length > 6) ds.splice(6);
			const a = normalizePlaces(ds).then((dsFilled) => {
				//console.log(dsFilled);
				this.setState({ dataSource: dsFilled.filter((i) => i.geometry) }), (err) => console.error(err)
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
    propTypes: {
        initialAddress1: React.PropTypes.string,
        initialAddress2: React.PropTypes.string,
        onAddress1Select: React.PropTypes.func.isRequired,
        onAddress2Select: React.PropTypes.func.isRequired
    },
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
                     onAddressSelect={this.props.onAddress1Select}
                     validations="isWords"
                     validationError={wordsError}
                     required
                     hintText="Россия, Москва, Тверская, 1"
                     floatingLabelText="Адрес (откуда)"
                     searchText={this.props.initialAddress1}
                     tabIndex={1}
                     />
                  <AddressGroupInput
                     name="address_from"
                     onAddressSelect={this.props.onAddress2Select}
                     validations="isWords"
                     validationError={wordsError}
                     required
                     hintText="Россия, Москва, Тверская, 2"
                     floatingLabelText="Адрес доставки (куда)"
                     searchText={this.props.initialAddress2}
                     tabIndex={2}
                     />
                  <FormsySelect
                     name="broker"
                     required
                     floatingLabelText="Ответственное лицо (брокер)"
                     tabIndex={3}>
                    {this.state.users.map( (i) => <MenuItem key={i.id} value={i.id} primaryText={`${i.email} ${i.first_name}`} /> )}
                  </FormsySelect><br/>
                  <FormsyToggle
                     name="toggle"
                     label="Toggle" />
                </Formsy.Form>
              </CardText>
              <CardActions>
                <RaisedButton label="Сохранить" primary={true} className={styles.but} tabIndex={7} />
                <RaisedButton label="Очистить" secondary={true} className={styles.but} tabIndex={8} />
              </CardActions>
            </Card>
        );
    }
});

export default OrderForm;
