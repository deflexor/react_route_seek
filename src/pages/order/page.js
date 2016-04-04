import React from 'react';

import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

import OrderForm from '../../common/components/OrderForm';
import OrderMap from '../../common/components/OrderMap';

import styles from './style.css';


const OrderView = React.createClass({
    handleAddress1Select(addr) {
        console.log('!', addr);
    },
    handleAddress2Select(addr) {
    },
    render() {
        return (
            <Grid>
              <Row>
                <Col xs={6}>
                  <OrderForm
                     handleAddress1Select={this.handleAddress1Select}
                     handleAddress2Select={this.handleAddress2Select} />
                </Col>
                <Col xs={6}>
                  <OrderMap />
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
