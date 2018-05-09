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
        <form onSubmit={this.sendForm} class="lgn-form">
            <h1>Inicia sesión</h1>
            <div class="imgcontainer">
                <img src="images/img_avatar2.png" alt="Avatar" class="avatar"></img>
            </div>
          <div class="lgn-container">
            <label htmlFor="username" class="lgn-input">Username: </label><br/>
            <input class="lgn-input" type="text" required name="username" id="username" /><br/>
            <label htmlFor="password" class="lgn-input">Password: </label><br/>
            <input class="lgn-input" type="password" required name="password" id="password" />
          </div>
          <button class="btn-lgn">Log in</button>
        </form>
      </div>
    );
  }
}

export default LoginForm;
