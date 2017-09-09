import React from 'react';
import {  Dropdown} from 'semantic-ui-react'
import { connect } from 'react-redux'
import { find_route, tramstopSelected, endstopSelected} from '../actions/actions'
class TramStopPicker extends React.Component {

	//TODO tests???

	fromUpdateValue(evt, data){
		const { dispatch, tramstops,endTram} = this.props;
		tramstopSelected(dispatch,tramstops[data.value]);

		if(typeof endTram!=='undefined'){
			const from_halt_id = tramstops[data.value].halt_id;;
			const  to_halt_id = endTram.halt_id;
			find_route(dispatch, from_halt_id, to_halt_id);
		}
	}

	toUpdateValue(evt, data){
		const { dispatch, tramstops, startTram } = this.props;
		endstopSelected(dispatch,tramstops[data.value]);

		if(typeof startTram!=='undefined'){
			const from_halt_id = startTram.halt_id;
			const  to_halt_id = tramstops[data.value]['halt_id'];
			find_route(dispatch, from_halt_id, to_halt_id);
		}
	}

		render () {
			let {tramstops, startTram, endTram} = this.props;
			let options_list = [];
			for(var key in tramstops){

				if (tramstops.hasOwnProperty(key)) {
					let option = {};

					//option['label'] = tramstops[key].halt_lang;
					option['text'] = tramstops[key].halt_lang;
					option['value'] = tramstops[key].halt_id;
					options_list.push(option);
				}
			}

		 	options_list.sort( function( a, b ) {
		 			a = a.text.toLowerCase();
		 			b = b.text.toLowerCase();
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
			let s1 = 	<Dropdown
								onChange={this.fromUpdateValue.bind(this)}
								value={start_selection}
 								 options={options_list}
									 selection
									 search
									 />
			const s2 = 		<Dropdown
													 onChange={this.toUpdateValue.bind(this)}
													 value={end_selection}
															options={options_list}
															selection
															/>

			//s1 =<NakedApp/>
			return (
				<div className='ui grid container'>
					<div className='row'>

						<div className='five wide column'>
							{s1}
						</div>
					</div>
					<div className='row'>
						<div className='three wide column'>
							{s2}
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
