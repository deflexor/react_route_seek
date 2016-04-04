import React from 'react';

import { GoogleMapLoader, GoogleMap, DirectionsRenderer, OverlayView } from "react-google-maps";
import {GMAPS_API_KEY} from "../../config.js";

import styles from './order_map.css';


const OrderMap = React.createClass({
    getInitialState() {
        return {
            directions: null,
            info: null
        };
    },
    componentWillReceiveProps: function(nextProps) {
        if(nextProps.points[0] && nextProps.points[1]) {
            this.calcDirections(nextProps.points);
        }
        else {
            this.setState({
                directions: null
            });
        }
    },
    calcDirections(points) {
        const DirectionsService = new google.maps.DirectionsService();
        DirectionsService.route({
            origin: points[0],
            destination: points[1],
            travelMode: google.maps.TravelMode.DRIVING
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.setState({
                    directions: result,
                    info: null
                });
            } else {
                console.error('error fetching directions', result);
                this.setState({
                    info: 'Direction error: ' + result.status,
                    directions: null
                });
            }
        });
    },
    render () {
        const { directions, info } = this.state;
        const center = this.props.center || { lat: 60, lng: 105 };
        const overlay = info ? (
            <OverlayView
               position={this.refs.map ? this.refs.map.getCenter() : center}
               mapPaneName={OverlayView.OVERLAY_LAYER}
               getPixelPositionOffset={this.getPixelPositionOffset}>
               <div className={styles.overlay}>
                 <h4>{info}</h4>
               </div>
            </OverlayView>
        ) : null;
        const container = (
            <div style={{ height: 480, width: 400 }} />
        );
        const gMap = (
            <GoogleMap
              ref="map"
              defaultZoom={12}
              defaultCenter={center}
              onClick={() => this.handleMapClick}>
              {directions ? <DirectionsRenderer directions={directions} /> : null}
              {overlay}
            </GoogleMap>
        );
        
        return (
            <GoogleMapLoader containerElement={container} googleMapElement={gMap} />
        );
    },
    getPixelPositionOffset(width, height) { return { x: -(width / 2), y: -(height / 2) };  },
});

export default OrderMap;
