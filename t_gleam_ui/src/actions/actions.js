const BASE_URL = 'http://localhost:5000'
//const BASE_URL = 'https://www.gleam.ch/someurl'
function standard_json_handler(response){
	if (!response.ok) {

		throw Error('Something went wrong retreiving currency information :(');
	}
	return response.json();
};

export const SWITCH_VIEW = 'SWITCH_VIEW'
function switchView(dispatch, new_view){
	dispatch({
		type: SWITCH_VIEW,
		newView: new_view
	})
}

export const SHOW_GLOBAL_MAP_MARKERS = 'SHOW_GLOBAL_MAP_MARKERS'
//const switchGlobalMapMarkers = value => (dispatch, value) => {
//function switchGlobalMapMarkers(dispatch, show){
//export const checkout = products => (dispatch, getState) => {
function switchGlobalMapMarkers(dispatch, new_value){
	dispatch(
		{
			type: SHOW_GLOBAL_MAP_MARKERS,
			show_markers : new_value
		}
	);
}

export const ROUTE_LOADED = 'ROUTE LOADED'
function find_route(dispatch, start_halte_id, end_halte_id){
  const rest_url = BASE_URL + '/search_route/'+ start_halte_id +'/'+end_halte_id;
  fetch(rest_url)
    .then(standard_json_handler)
    .then((route) => {
      dispatch(
        {
          type: ROUTE_LOADED,
          route: route
        });
    });
}



function loadStop(halte_id, on_found){
	/*const rest_url = 'http://localhost:5000/geo_loc/'+ halte_id;
	fetch(rest_url)
		.then(standard_json_handler)
		.then((responseData) => {
			on_found(responseData[0]);
		});
	*/
	const rest_url = BASE_URL + '/foo/get_loc';
	let body = JSON.stringify({ 'halt_id': halte_id});

	fetch(rest_url,
		{ method: 'POST',
		headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
				//'Content-Type': 'text/plain',
		  },
			'body': body
		})
		.then(standard_json_handler)
		.then((responseData) => {
			on_found(responseData[0]);
		});
}

export const SELECT_START = 'SELECT START'
function tramstopSelected(dispatch, selection){
	loadStop(selection['halt_id'], (tramStop)=> {
		dispatch({
			type: SELECT_START,
			startTram: tramStop,
			pickStartTram:selection
		});
	});
}

export const SELECT_END = 'SELECT END'
function endstopSelected(dispatch, selection){
	loadStop(selection['halt_id'], (tramStop)=> {
		dispatch({
			type: SELECT_END,
			endTram: tramStop,
			pickEndTram:selection
		});



	});
}

function loadTramLineStats(dispatch, linie_num){
		const rest_url = BASE_URL + '/line_stats/' + linie_num;
		fetch(rest_url)
			.then(standard_json_handler)
			.then((route) => {
			dispatch({
				type: ROUTE_LOADED,
				route:  route

			});
		});
}


function transform_stops(stops_json){

	let result  = {};
	for(var i = 0; i<stops_json.length; i++){
		let item = stops_json[i];
		result[item.halt_id] = item;
	}

	return result;

}

export const ALL_STOPS_AVAILABLE = 'ALL_STOPS_AVAILABLE';
function load_tramstops(dispatch){
	fetch(BASE_URL +'/soll_ist').then(standard_json_handler)
		.then((responseData) => {
			let _options = transform_stops(responseData);
			dispatch({
				type: ALL_STOPS_AVAILABLE ,
				tramstops: _options
			});

		});


}

function transform_geos(data){
	//TODO This is 1 to 1 the same as transform_stops
	//maybe combine and change to "key_by_halt_id" or similar?
	let result  = {};
	for(var i = 0; i<data.length; i++){
		let item = data[i];
		result[item.halt_id] = item;
	}

	return result;
}
export const ALL_GEOS_AVAILABLE = 'ALL_GEOS_AVAILABLE';
function load_geo_for_all_stops(dispatch){
	fetch(BASE_URL+'/geo_locs').then(standard_json_handler)
		.then((responseData) => {
			let geo_locs = transform_geos(responseData);
			dispatch({
				type: ALL_GEOS_AVAILABLE ,
				tramstop_geo_locs: geo_locs
			});

		});
}

export const NEAREST_STOP_LOADED = 'NEAREST_STOP_LOADED';
export function load_nearest_stop(dispatch){
	fetch(BASE_URL+'/nearest_stop').then(standard_json_handler)
		.then((nearest_stop) => {
				const nearest_halt_id = nearest_stop['nearest_halt_id'];
				const zurich_hb = 1541;
				dispatch({
					type: NEAREST_STOP_LOADED,
					halt_id: nearest_halt_id,
					end_halt_id: zurich_hb,
					screen: 'landing_screen'
				});
		});
	}

export { load_tramstops, standard_json_handler, find_route, switchGlobalMapMarkers,
	switchView, tramstopSelected, endstopSelected, loadTramLineStats,
load_geo_for_all_stops};
