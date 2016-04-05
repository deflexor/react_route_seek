import React from 'react';

import { GoogleMapLoader, GoogleMap, DirectionsRenderer, Marker, OverlayView } from "react-google-maps";
import {GMAPS_API_KEY} from "../../config.js";

import styles from './order_map.css';

import {geocodeLocations} from '../../utils.js';


const OrderMap = React.createClass({
    propTypes: {
        onPointsChanged: React.PropTypes.func.isRequired,
        points: React.PropTypes.array.isRequired
    },
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
    directionsChanged() {
        const dirs = this.refs.dirs.getDirections().geocoded_waypoints;
		geocodeLocations(dirs).then((places) =>
			this.props.onPointsChanged(places));
    },
    markerPosChanged(e) {
		const positions = [0,1].map((i) => this.refs['mk'+i]).map((r) => r ? r.getPosition() : null);
		geocodeLocations(positions).then((places) =>
			this.props.onPointsChanged(places));
    },
    render () {
        const { directions, info } = this.state;
        const center = this.props.center || { lat: 60, lng: 105 };
        const directionsNode = directions ?
              <DirectionsRenderer ref="dirs" directions={directions} options={{draggable:true}} onDirectionsChanged={this.directionsChanged} /> :
              null;
        const overlayNode = info ? (
            <OverlayView
               position={this._googleMap ? this._googleMap.getCenter() : center}
               mapPaneName={OverlayView.OVERLAY_LAYER}
               getPixelPositionOffset={this.getPixelPositionOffset}>
               <div className={styles.overlay}>
                 <h4>{info}</h4>
               </div>
            </OverlayView>
        ) : null;
		const markerNodes = directionsNode ? [] : this.props.points.map((p, i) => {
			if(p) {
				if(this._googleMap) this._googleMap.panTo(p);
				return (<Marker position={p} key={i} ref={'mk' + i} draggable={true} onDragend={this.markerPosChanged} />);
			}
			else return null;
		});
        const container = (
            <div style={{ height: 480, width: 400 }} />
        );
        const gMap = (
            <GoogleMap
              ref={(map) => { if(map) { window.googleMap = map.props.map; this._googleMap = map } }}
              defaultZoom={12}
              defaultCenter={center}
              onClick={() => this.handleMapClick}>
			  {markerNodes}
              {directionsNode}
              {overlayNode}
            </GoogleMap>
        );
        
        return (
            <GoogleMapLoader containerElement={container} googleMapElement={gMap} />
        );
    },
    getPixelPositionOffset(width, height) { return { x: -(width / 2), y: -(height / 2) };  },
});

export default OrderMap;
