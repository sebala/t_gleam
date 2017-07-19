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
} from 'semantic-ui-react'

const options = [
  { value: 'all', text: 'All' },
  { value: 'articles', text: 'Articles' },
  { value: 'products', text: 'Products' },
]

class NakedApp extends React.Component {
  constructor(props) {
		super(props);

    this.state = { value: 'all' }
  }

  reset() {
    this.setState({ value: undefined })
  }

  setProducts() {
    this.setState({ value: 'products' })
  }

  setValue(e, data) {
    this.setState({ value: data.value })
  }

  render() {
    const { value } = this.state

    return (
      <Container>

        <Dropdown
          onChange={this.setValue.bind(this)}
          options={options}
          selection
        />



      </Container>
    )
  }
}

export default NakedApp;
