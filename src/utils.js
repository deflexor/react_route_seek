

export function fetchPlaces(places) {
	if(!window.placesService && window.googleMap) window.placesService = new google.maps.places.PlacesService(window.googleMap);
	if(!window.placesService) return Promise.resolve([]);
	const placesFilledP = places.map((d) => new Promise((resolve, reject) => {
		if(d && 'place_id' in d) {
			placesService.getDetails({ placeId: d.place_id }, (res, st) => {
				if(st == google.maps.places.PlacesServiceStatus.OK)
					resolve(res);
				else {
					//console.error(res, st);
					resolve(null);
				}
			});
		}
		else {
			resolve(null);
		}
	}));
	return Promise.all(placesFilledP);
}

export function geocodeLocations(locs) {
	if(!window.geoService) window.geoService = new google.maps.Geocoder;
	const locsFilledP = locs.map((d) => new Promise((resolve, reject) => {
		if(d) {
			let req = { location: d };
			if('place_id' in d)
				req = { placeId: d.place_id };
			geoService.geocode(req, (res, st) => {
				resolve(st == google.maps.GeocoderStatus.OK ? res[0] : null);
			});
		}
		else {
			resolve(null);
		}
	}));
	return Promise.all(locsFilledP);
}

