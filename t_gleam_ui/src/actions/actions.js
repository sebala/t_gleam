
const BASE_URL = 'http://localhost:5000'

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
      //TODO HACK - json serialization in server is broken; fix it
      const new_route = route.map((x) => x[0]);
      dispatch(
        {
          type: ROUTE_LOADED,
          route: new_route
        });
    });
		/*
		const rest_url = 'http://localhost:5000/foo/search_route';

		let body = JSON.stringify({
				from_halt_id: start_halte_id,
				to_halt_id: end_halte_id
		});

		fetch(rest_url,
			{ method: 'POST',
			headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json'
			  },
				'body': body
			})
			.then(standard_json_handler)
			.then((route) => {
				//TODO HACK - json serialization in server is broken; fix it
	      const new_route = route.map((x) => x[0]);
	      dispatch(
	        {
	          type: 'ROUTE LOADED',
	          route: new_route
	        });
			});*/

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
			startTram: tramStop
		});
	});
}

export const SELECT_END = 'SELECT END'
function endstopSelected(dispatch, selection){
	loadStop(selection['halt_id'], (tramStop)=> {
		dispatch({
			type: SELECT_END,
			endTram: tramStop
		});



	});
}

export { standard_json_handler, find_route, switchGlobalMapMarkers, switchView, tramstopSelected, endstopSelected};
