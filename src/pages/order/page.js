import React from 'react';

import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

import OrderForm from '../../common/components/OrderForm';
import OrderMap from '../../common/components/OrderMap';

import styles from './style.css';


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
        this.setState({ point1: place.geometry.location });
    },
    handleAddress2Select(place) {
        this.setState({ point2: place.geometry.location });
    },
    handleDirectionsChange(dirs) {
		//dirs.geocoded_waypoints
        const {start_address, end_address, start_location, end_location} = dirs.routes[0].legs[0];
        this.setState({ initialAddress1: start_address,
                        initialAddress2: end_address,
                        point1: start_location,
                        point2: end_location
                      });
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
                  <OrderMap points={[this.state.point1, this.state.point2]} onDirectionsChanged={this.handleDirectionsChange} />
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
