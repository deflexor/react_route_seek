import React from 'react';

import AutoComplete from 'material-ui/lib/auto-complete';
import RaisedButton from 'material-ui/lib/raised-button';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardTitle from 'material-ui/lib/card/card-title';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import MenuItem from 'material-ui/lib/menus/menu-item';

import FMUI from 'formsy-material-ui';
const { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup, FormsySelect, FormsyText, FormsyTime, FormsyToggle } = FMUI;
import FormsyAutoText from './FormsyAutoText';
import FormsyLocDate from './FormsyLocDate';

import fetch from 'isomorphic-fetch';

import styles from './order_form.css';

import {fetchPlaces} from '../../utils.js';

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
            const a = fetchPlaces(ds).then((dsFilled) => {
                //console.log(dsFilled);
                this.setState({ dataSource: dsFilled.filter((i) => i && i.geometry) }), (err) => console.error(err)
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
            users: [],
            address1: null,
            address2: null,
            canSubmit: false
        };
    },
    componentDidMount() {
        this.serverRequest = fetch('/api/users.json').then((r) => r.json()).then((j) => {
            this.setState({
                users: j.results
            });
        });
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({
            address1: nextProps.initialAddress1,
            address2: nextProps.initialAddress2
        });
    },
    enableButton () {
        this.setState({
            canSubmit: true
        });
    },
    disableButton() {
        this.setState({
            canSubmit: false
        });
    },
    submitForm (model, reset, invalidate) {
        // Submit your validated form
        console.log("Model: ", model);
    },
    onAddress1Select(place) {
        this.setState({ address1: place });
        this.props.onAddress1Select(place);
    }, 
    onAddress2Select(place) {
        this.setState({ address2: place });
        this.props.onAddress2Select(place);
    }, 
    render() {
        const {wordsError} = ErrorMessages;
        
        return (
            <Formsy.Form
              ref="form"
              onValid={this.enableButton}
              onInvalid={this.disableButton}
              onValidSubmit={this.submitForm}
            >
              <Card className={styles.card}>
                <CardTitle title="Адреса загрузки и выгрузки" subtitle="точки доставки" className={styles.cardTitle} />
                <CardText>
                  <AddressGroupInput
                      name="address_from"
                      onAddressSelect={this.onAddress1Select}
                      validations="isWords"
                      validationError={wordsError}
                      required
                      hintText="Россия, Москва, Тверская, 1"
                      floatingLabelText="Адрес (откуда)"
                      searchText={this.props.initialAddress1}
                      fullWidth={true}
                      tabIndex={1}
                  />
                  <AddressGroupInput
                      name="address_from"
                      onAddressSelect={this.onAddress2Select}
                      validations="isWords"
                      validationError={wordsError}
                      required
                      hintText="Россия, Москва, Тверская, 2"
                      floatingLabelText="Адрес доставки (куда)"
                      searchText={this.props.initialAddress2}
                      fullWidth={true}
                      tabIndex={2}
                  />
                </CardText>
                <CardTitle title="Параметры заказа" subtitle="основные параметры заказа" className={styles.cardTitle} />
                <CardText>
                  <FormsySelect
                      name="broker"
                      required
                      floatingLabelText="Ответственное лицо (брокер)"
                      tabIndex={3}>
                    {this.state.users.map( (i) => <MenuItem key={i.id} value={i.id} primaryText={`${i.email} ${i.first_name}`} /> )}
                  </FormsySelect><br/>
                  <label className={styles.label1}>Дата загрузки 
                    <FormsyLocDate
                        name="start_date_up"
                        autoOk={true}
                        hintText="от"
                        tabIndex={4}
                    />
                    <FormsyLocDate
                        name="start_date_down"
                        autoOk={true}
                        hintText="до"
                        tabIndex={5}
                    />
                  </label>
                  <label className={styles.label1}>Дата выгрузки 
                    <FormsyLocDate
                        name="end_date_up"
                        autoOk={true}
                        hintText="от"
                        tabIndex={6}
                    />
                    <FormsyLocDate
                        name="end_date_down"
                        autoOk={true}
                        hintText="до"
                        tabIndex={7}
                    />
                  </label>
                  <FormsyText
                      name="code"
                      validationError={wordsError}
                      required
                      hintText="12345"
                      floatingLabelText="Номер заказа"
                      tabIndex={8}
                  /><br/>
                  <FormsyText
                      name="fix_total"
                      required
                      hintText="1.00"
                      floatingLabelText="Fix total"
                      tabIndex={9}
                  /><br/>
                  <FormsyText
                      name="comments"
                      multiLine={true}
                      rows={3}
                      floatingLabelText="Комментарий"
                      tabIndex={10}
                  /><br/>
                </CardText>
                <CardActions>
                  <RaisedButton label="Сохранить" type="submit" primary={true} tabIndex={11}  />
                  <RaisedButton label="Очистить" type="reset" secondary={true} tabIndex={12} />
                </CardActions>
              </Card>
            </Formsy.Form>
        );
    }
});

export default OrderForm;
