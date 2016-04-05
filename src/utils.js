

export function normalizePlaces(places) {
	if(!window.placesService && window.googleMap) window.placesService = new google.maps.places.PlacesService(window.googleMap);
	if(!window.placesService) return Promise.resolve([]);
	const placesFilledP = places.map((d) => new Promise((resolve, reject) => {
		placesService.getDetails({ placeId: d.place_id }, (res, st) => {
			if(st == google.maps.places.PlacesServiceStatus.OK)
				resolve(res);
			else {
				//console.error(res, st);
				resolve({});
			}
		});
	}));
	return Promise.all(placesFilledP);
}

