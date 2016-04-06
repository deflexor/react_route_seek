import React from 'react';
import update from 'react-addons-update';


import AutoComplete from 'material-ui/lib/auto-complete';
import RaisedButton from 'material-ui/lib/raised-button';
import IconButton from 'material-ui/lib/icon-button';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardTitle from 'material-ui/lib/card/card-title';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import MenuItem from 'material-ui/lib/menus/menu-item';
import TextField from 'material-ui/lib/text-field';

import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';

import RmIcon from 'material-ui/lib/svg-icons/content/remove-circle-outline';
import AddIcon from 'material-ui/lib/svg-icons/content/add-circle-outline';

import FMUI from 'formsy-material-ui';
const { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup, FormsySelect, FormsyTime, FormsyToggle } = FMUI;
import FormsyAutoText from './FormsyAutoText';
import FormsyLocDate from './FormsyLocDate';
import FormsyText from './FormsyTextLight';

import fetch from 'isomorphic-fetch';

import styles from './order_form.css';

import {geocodeLocations, fetchPlaces} from '../../utils.js';

const acService = new google.maps.places.AutocompleteService();

function trustfulFilter(searchText, key) {
    return true;
}

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
            const a = geocodeLocations(ds).then((dsFilled) => {
                //console.log(dsFilled);
                this.setState({ dataSource: dsFilled.filter((i) => i && i.geometry) }), (err) => console.error(err)
            });
        });
    },
    getValue() {
        return this.state.selected !== null ? this.state.dataSource[this.state.selected] : null;
    },
    render() {
        return (
            <FormsyAutoText {...this.props}
                            dataSource={this.state.dataSource.map((r) => r.formatted_address)}
                            onUpdateInput={this.handleUpdateInput}
                            onNewRequest={this.handleNewRequest}
                            filter={trustfulFilter} />
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
            canSubmit: false,
            orderLines: []
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
        console.log(model);
        const geoPlaces = ["from_place", "to_place"].map( (n) => this.refs[n].getValue() );
        //fetchPlaces(geoPlaces).then((places) => {
        ["from_place", "to_place"].forEach((n, i) => model[n] = geoPlaces[i]);
        model.items = this.state.orderLines;
        fetch('/api/orders.json', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(model)
        }).then((r) => r.json()).then((r) => {
            if('errors' in r)
                invalidate(r.errors)
            else
                alert('Добавлен заказ!');
        });
    },
    onAddress1Select(place) {
        this.setState({ address1: place });
        this.props.onAddress1Select(place);
    }, 
    onAddress2Select(place) {
        this.setState({ address2: place });
        this.props.onAddress2Select(place);
    },
    addItemRow() {
        const row = { cargo: '', price: '0.0', order: '1' };
        this.setState({ orderLines: update(this.state.orderLines, { $push: [row] }) });
    },
    delItemRow(i) {
        this.setState({ orderLines: update(this.state.orderLines, { $splice: [[i, 1]] }) });
    },
    onRowItemChanged(e, fld, idx) {
        const v = e.target.value;
        const ol = this.state.orderLines.slice();
        ol[idx][fld] = v;
        this.setState({ orderLines: ol });
        //this.setState({ orderLines: update(this.state.orderLines, { [idx]: { [fld]: { $set: v } } }) });
    },
    render() {
        return (
            <Formsy.Form
              ref="form"
              onSubmit={this.submitForm}
            >
              <Card className={styles.card}>
                <CardTitle title="Адреса загрузки и выгрузки" subtitle="точки доставки" className={styles.cardTitle} />
                <CardText>
                  <AddressInput
                      name="from_place"
                      ref="from_place"
                      onAddressSelect={this.onAddress1Select}
                      required
                      hintText="Россия, Москва, Тверская, 1"
                      floatingLabelText="Адрес (откуда)"
                      searchText={this.props.initialAddress1}
                      fullWidth={true}
                      tabIndex={1}
                  />
                  <AddressInput
                      name="to_place"
                      ref="to_place"
                      onAddressSelect={this.onAddress2Select}
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
                    /><br/>
                    <FormsyLocDate
                        name="start_date_down"
                        autoOk={true}
                        hintText="до"
                        tabIndex={5}
                    />
                  </label><br/>
                  <label className={styles.label1}>Дата выгрузки 
                    <FormsyLocDate
                        name="end_date_up"
                        autoOk={true}
                        hintText="от"
                        tabIndex={6}
                    /><br/>
                    <FormsyLocDate
                        name="end_date_down"
                        autoOk={true}
                        hintText="до"
                        tabIndex={7}
                    />
                  </label><br/>
                  <FormsyText
                      name="code"
                      hintText="12345"
                      floatingLabelText="Номер заказа"
                      tabIndex={8}
                  /><br/>
                  <FormsyText
                      name="fix_total"
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
                <CardTitle title="Состав заказа" subtitle="список позиций заказа" className={styles.cardTitle}/>
                <CardText>
                  <div className={styles.clear}></div>
                  <Table selectable={false}>
                  <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                      <TableRow>
                        <TableHeaderColumn>Название</TableHeaderColumn>
                        <TableHeaderColumn>Цена</TableHeaderColumn>
                        <TableHeaderColumn>Количество</TableHeaderColumn>
                        <TableHeaderColumn><IconButton onTouchTap={this.addItemRow} className={styles.svgGreen}><AddIcon /></IconButton></TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                   <TableBody displayRowCheckbox={false} selectable={false}>
                      {this.state.orderLines.map((ol, i) => 
                          <TableRow key={i} selectable={false}>
                            <TableRowColumn><TextField name="items1.cargo" value={ol.cargo} onChange={(e) => this.onRowItemChanged(e, 'cargo', i)} /></TableRowColumn>
                            <TableRowColumn><TextField name="items1.price" value={ol.price} onChange={(e) => this.onRowItemChanged(e, 'price', i)} /></TableRowColumn>
                            <TableRowColumn><TextField name="items1.order" value={ol.order} onChange={(e) => this.onRowItemChanged(e, 'order', i)} /></TableRowColumn>
                            <TableRowColumn><IconButton onTouchTap={() => this.delItemRow(i)} className={styles.svgRed}><RmIcon /></IconButton>
                            </TableRowColumn>
                          </TableRow>
                      )}
                    </TableBody>
                  </Table>
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
