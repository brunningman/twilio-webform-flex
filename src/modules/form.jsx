import React from 'react';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    fetch('127.0.0.1/3000/blast', {
      method: 'POST',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state), // body data type must match "Content-Type" header
    })
    .then(response => response.json());
  }

  render() {
    return <div id="blast-form">
      <form onSubmit={this.handleSubmit} >
        <label>Message:
          <input type="text" name="message" value={this.state.message} onChange={this.handleChange} required/>
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  };
}

export default Form;
