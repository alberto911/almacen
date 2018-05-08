import React, { Component } from 'react';
import { formToJSON } from './helper';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.sendForm = this.sendForm.bind(this);
  }

  sendForm(e) {
    e.preventDefault();
    var json = formToJSON(e.target);
    e.target.reset();
    fetch('/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: json
    })
      .then(res => res.json())
      .then(user => this.props.authenticate(true, user.username))
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div>
        <h1>Inicia sesión</h1>
        <form onSubmit={this.sendForm}>
          <div>
            <label htmlFor="username">Username: </label>
            <input type="text" required name="username" id="username" />
          </div>
          <div>
            <label htmlFor="password">Password: </label>
            <input type="password" required name="password" id="password" />
          </div>
          <button>Log in</button>
        </form>
      </div>
    );
  }
}

export default LoginForm;
