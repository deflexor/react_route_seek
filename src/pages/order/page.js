import React from 'react';

import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

import OrderForm from '../../common/components/OrderForm';
import OrderMap from '../../common/components/OrderMap';

import styles from './style.css';

import {fetchPlaces} from '../../utils.js';


const OrderView = React.createClass({
    getInitialState() {
        return {
            point1: null,
            point2: null,
            initialAddress1: null,
            initialAddress2: null
        };
    },
    handleAddress1Select(place) {
        if(place && place.geometry) this.setState({ point1: place.geometry.location });
    },
    handleAddress2Select(place) {
        if(place && place.geometry) this.setState({ point2: place.geometry.location });
    },
    handlePointsChange(points) {
		const sobj = {};
		if(points[0]) {
			sobj.initialAddress1 = points[0].formatted_address;
			sobj.point1 = points[0].geometry.location;
		}
		if(points[1]) {
			sobj.initialAddress2 = points[1].formatted_address;
			sobj.point2 = points[1].geometry.location;
		}
        this.setState(sobj);
    },
    render() {
        return (
            <Grid>
              <Row>
                <Col xs={6}>
                  <OrderForm
                      initialAddress1={this.state.initialAddress1}
                      initialAddress2={this.state.initialAddress2}
                      onAddress1Select={this.handleAddress1Select}
                      onAddress2Select={this.handleAddress2Select} />
                </Col>
                <Col xs={6}>
                  <OrderMap points={[this.state.point1, this.state.point2]} onPointsChanged={this.handlePointsChange} />
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
