import React from 'react';

import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

import OrderForm from '../../common/components/OrderForm';
import OrderMap from '../../common/components/OrderMap';

import styles from './style.css';


const OrderView = React.createClass({
    getInitialState() {
        return {
            point1: null,
            point2: null
        };
    },
    handleAddress1Select(place) {
        this.setState({ point1: place.geometry.location });
    },
    handleAddress2Select(place) {
        this.setState({ point2: place.geometry.location });
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
                  <OrderMap points={[this.state.point1, this.state.point2]} />
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
