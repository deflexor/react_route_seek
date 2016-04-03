import React from 'react';

import RaisedButton from 'material-ui/lib/raised-button';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import MenuItem from 'material-ui/lib/menus/menu-item';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

import FMUI from 'formsy-material-ui';
const { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup, FormsySelect, FormsyText, FormsyTime, FormsyToggle } = FMUI;
import FormsyAutoText from '../../common/components/FormsyAutoText';


import fetch from 'isomorphic-fetch';

import styles from './style.css';


const ErrorMessages = {
    wordsError: "Please only use letters"
};

const AddressTextField = React.createClass({
    getInitialState() {
        return {
            dataSource: []
        };
    },
    handleUpdateInput(t) {
        this.setState({
            dataSource: [t, t + t, t + t + t]
        });
    },
    render() {
        return (
            <FormsyAutoText {...this.props} dataSource={this.state.dataSource} onUpdateInput={this.handleUpdateInput} />
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
                  <AddressTextField
                     name="address_from"
                     validations="isWords"
                     validationError={wordsError}
                     required
                     hintText="Тверская, 1"
                     floatingLabelText="Адрес (откуда)"
                     /><br/>
                  <AddressTextField
                     name="address_from"
                     validations="isWords"
                     validationError={wordsError}
                     required
                     hintText="Тверская, 1"
                     floatingLabelText="Адрес доставки (куда)"
                     /><br/>
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

const OrderView = React.createClass({
    render() {
        return (
            <Grid>
              <Row>
                <Col xs={6}>
                  <OrderForm/>
                </Col>
                <Col xs={6}>
                </Col>
              </Row>
            </Grid>
        );
    }
});

export default React.createClass({
    render() {
        return (
            <div className={styles.content}>
			  <h1>Новый заказ</h1>
              <OrderView/>
            </div>
        );
    }
});
