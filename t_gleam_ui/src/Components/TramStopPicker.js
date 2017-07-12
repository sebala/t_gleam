import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'
import { find_route, standard_json_handler, tramstopSelected, endstopSelected} from '../actions/actions'

class TramStopPicker extends React.Component {

//TODO make options part of the global state
//TODO make fromSelectValue, toSelectValue part of state
//TODO "on loading for options" -> i.e. add it to the actions et c.
//TODO tests???
	constructor(props) {
		super(props);

		this.state = {
			fromSelectValue: null,
			toSelectValue: null
		};

	}

	componentDidMount(){
		this.get_tramstops2();
	}

	soll_ist = null;

	transform_stops2(stops_json){
		this.soll_ist = stops_json;
		let result = Object.keys(stops_json).map(key =>{
			 return { value: key,
				 label: stops_json[key]['halt_lang'] }
			 });

		 result.sort( function( a, b ) {
				a = a.label.toLowerCase();
				b = b.label.toLowerCase();

				return a < b ? -1 : a > b ? 1 : 0;
		});
		return result;
	}

	get_tramstops2(){
		fetch('http://localhost:5000/soll_ist').then(standard_json_handler)
			.then((responseData) => {
				let _options = this.transform_stops2(responseData);
				this.setState({
					options: _options
				})
			});


	}


	fromUpdateValue(evt){
		this.setState({
			fromSelectValue: evt
		});
		const { dispatch } = this.props;

		tramstopSelected(dispatch,this.soll_ist[evt]);

		const from_halt_id = this.soll_ist[evt]['halt_id'];
		const  to_halt_id = this.soll_ist[this.state.toSelectValue]['halt_id'];
		find_route(dispatch, from_halt_id, to_halt_id);
	}

	toUpdateValue(evt){
		this.setState({
			toSelectValue: evt
		});
		const { dispatch } = this.props;

		endstopSelected(dispatch,this.soll_ist[evt]);

		const from_halt_id = this.soll_ist[this.state.fromSelectValue]['halt_id'];
		const  to_halt_id = this.soll_ist[evt]['halt_id'];
		find_route(dispatch, from_halt_id, to_halt_id);
	}

	/*
	fireFindRoute(){
		const { dispatch } = this.props;
		const from_halt_id = this.soll_ist[this.state.fromSelectValue]['halt_id'];
		const  to_halt_id = this.soll_ist[this.state.toSelectValue]['halt_id'];
		find_route(dispatch, from_halt_id, to_halt_id);
	}
	*/
	render () {

		return (
					<div className="container_moin">
						<p>Select stops</p>
						<div className="row">
							<div className="col-md-6 ul_on_top">
									<Select ref="stateSelect"
											autofocus options={this.state.options}
											simpleValue
											label="From"
											 value={this.state.fromSelectValue}
											 onChange={val =>this.fromUpdateValue(val)}
											 />
							</div>
							<div className="col-md-6 ul_on_top" >
									<Select ref="stateSelect"
											autofocus options={this.state.options}
											simpleValue
											label="From"
											 value={this.state.toSelectValue}
											 onChange={val =>this.toUpdateValue(val)}
											 />
									</div>
						</div>
					</div>
		);
	}
}

const mapStateToProps = (state)=> {
    return   {

    }
};

//export default TramStopPicker;
export default connect(mapStateToProps)(TramStopPicker)
