/* eslint-disable */
//Disable all warnings since this is just a "playground" to try
//random ideas/layouts
import React from 'react';
import {
  Button,
  Container,
  Divider,
  Dropdown,
  Label,
  Input,
  Form,
  FormField
} from 'semantic-ui-react'

class JourneyFilter extends React.Component {

  render(){

    return    (<Form>
                  <Form.Field>
                    <label>Min journeys</label>
                    <Input fluid placeholder='min journeys' type='number' min='0'/>
                         <div className="ui range" id="smooth"></div>
                  </Form.Field>
                  <Form.Field>
                    <label>Day</label>
                    <Dropdown fluid search selection
                      options={[
                        {value: 'Monday', 'text':'Monday'},
                        {value: 'Tuesday', 'text':'Tuesday'},
                        {value: 'Wednesday', 'text':'Wednesday'},
                        {value: 'Thursday', 'text':'Thursday'},
                        {value: 'Friday', 'text':'Friday'},
                        {value: 'Saturday', 'text':'Saturday'},
                        {value: 'Sunday', 'text':'Sunday'}

                      ]}/>
                  </Form.Field>

                </Form>);
  }
}

/**
<div>
            <div className="ui form">

              <div className="fields">
                  <div className="field">
                      <label htmlFor='cf'>Min journeys</label>
                      <div className="ui search">
                        <div className="ui icon input">
                          <input id='cf' type="number" placeholder="Min journeys" min='1'/>
                        </div>
                      </div>
                  </div>
              </div>
              <div className="divider"/>
              <div className="fields">
                  <div className="field">
                      <label htmlFor='route'>Route</label>
                      <div className="ui search">
                        <select className="ui fluid search dropdown" multiple="">
                            <option value="Mo">Moon</option>
                            <option value="Tu">Tuesday</option>
                            <option value="We">Wodnesday</option>
                            <option value="Th">Thorsday</option>
                            <option value="Fr">Freeday</option>
                            <option value="St">Saturnsday</option>
                            <option value="Su">Sunsdays</option>
                        </select>
                      </div>
                  </div>
              </div>


          </div>
        </div>
    */
export default JourneyFilter;
