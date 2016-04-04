import React from 'react';

import { GoogleMapLoader, GoogleMap, InfoWindow } from "react-google-maps";
import {GMAPS_API_KEY} from "../../config.js";



const OrderMap = React.createClass({
    getInitialState() {
        return {
            dataSource: []
        };
    },
    componentDidMount() {
    },
    render () {
        const contents = [];
        const center = this.props.center || {
          lat: 60,
          lng: 105
        };
        const container = (
            <div {...this.props} style={{ height: 480, width: 400 }} />
        );
        const gMap = (
            <GoogleMap
              ref="map"
              defaultZoom={12}
              defaultCenter={center}
              onClick={() => this.handleMapClick}>
              {contents}
            </GoogleMap>
        );
        
        return (
            <GoogleMapLoader containerElement={container} googleMapElement={gMap} />
        );
    }
});

export default OrderMap;
