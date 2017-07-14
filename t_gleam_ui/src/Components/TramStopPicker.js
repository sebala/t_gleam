import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'
import { find_route, tramstopSelected, endstopSelected} from '../actions/actions'

class TramStopPicker extends React.Component {

	//TODO tests???

	fromUpdateValue(evt){
		const { dispatch, tramstops,endTram} = this.props;
		tramstopSelected(dispatch,tramstops[evt]);

		if(typeof endTram!=='undefined'){
			const from_halt_id = tramstops[evt].halt_id;;
			const  to_halt_id = endTram.halt_id;
			find_route(dispatch, from_halt_id, to_halt_id);
		}
	}

	toUpdateValue(evt){
		const { dispatch, tramstops, startTram } = this.props;
		endstopSelected(dispatch,tramstops[evt]);

		if(typeof startTram!=='undefined'){
			const from_halt_id = startTram.halt_id;
			const  to_halt_id = tramstops[evt]['halt_id'];
			find_route(dispatch, from_halt_id, to_halt_id);
		}
	}

		render () {
			let {tramstops, startTram, endTram} = this.props;
			let options_list = [];
			for(var key in tramstops){

				if (tramstops.hasOwnProperty(key)) {
					let option = {};

					option['label'] = tramstops[key].halt_lang;
					option['value'] = tramstops[key].halt_id;
					options_list.push(option);
				}
			}

		 	options_list.sort( function( a, b ) {
		 			a = a.label.toLowerCase();
		 			b = b.label.toLowerCase();
		 			return a < b ? -1 : a > b ? 1 : 0;
		 	});

			let start_selection = '';
			if(typeof startTram!=='undefined'){
				start_selection = startTram.halt_id;
			}

			let end_selection = '';
			if(typeof endTram!=='undefined'){
				end_selection = endTram.halt_id;
			}
			return (
					<div className="container_moin">
						<p>Select stops</p>
						<div className="row">
							<div className="col-md-6 ul_on_top">
									<Select ref="stateSelect"
											autofocus options={options_list}
											simpleValue
											label="From"
											 value={start_selection}
											 onChange={val =>this.fromUpdateValue(val)}
											 />
							</div>
							<div className="col-md-6 ul_on_top" >
									<Select ref="stateSelect"
											autofocus options={options_list}
											simpleValue
											label="From"
											 value={end_selection}
											 onChange={val =>this.toUpdateValue(val)}
											 />
									</div>
						</div>
					</div>
		);
	}
}
const TramStopPickerContainer = ({ tramstops, dispatch, startTram, endTram }) => {
  return (
    <TramStopPicker tramstops={tramstops}
				dispatch={dispatch}
				startTram={startTram}
				endTram={endTram}/>
  )
};

const mapStateToProps = (state)=> {
    return   {
			tramstops: state.tramstops,
			 dispatch: state.dispatch,
			 startTram: state.pickStartTram,
			 endTram: state.pickEndTram
    }
};

export default connect(mapStateToProps)(TramStopPickerContainer)
