import React from 'react';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      imgURL: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    fetch('/messages/send', {
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
          <textarea name="message" value={this.state.message} onChange={this.handleChange} required/>
        </label>
        <label>Image URL (Optional):
          <input type="text" name="imgURL" value={this.state.imgURL} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Send SMS to All Subscribers" />
      </form>
    </div>
  };
}

export default Form;
