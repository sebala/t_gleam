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

export default JourneyFilter;
