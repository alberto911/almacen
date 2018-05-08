import React, { Component } from 'react';
import ProductList from './ProductList';
import LoginForm from './LoginForm';
import Home from './Home';
import { Route, Redirect } from 'react-router-dom';

class Main extends Component {
  constructor(props) {
    super(props);
    this.isLoggedIn = this.isLoggedIn.bind(this);
    this.updateCredentials = this.updateCredentials.bind(this);
    this.state = {
      isAuthenticated: false,
      username: ''
    };
    this.isLoggedIn();
  }

  isLoggedIn() {
    return fetch('/loggedin', { credentials: 'include'})
      .then(res => res.json())
      .then(res => {
        var username = '';
        if (res.user) username = res.user.username;
        this.setState({ isAuthenticated: res.authenticated, username: username })
      })
      .catch(err => console.error(err));
  }

  updateCredentials(isAuth, username) {
    this.setState({
      isAuthenticated: isAuth,
      username: username
    });
  }

  render() {
    return (
      <div>
        <Route exact={true} path={'/'} render={() => (
          this.state.isAuthenticated ?
            <Home username={this.state.username} updateCredentials={this.updateCredentials} /> :
            <LoginForm authenticate={this.updateCredentials} />
        )} />
        <Route path="/materiasprimas" render={() => (
          this.state.isAuthenticated ?
            <ProductList type="materiasprimas" name="Materias primas" /> :
            <Redirect to='/' />
        )} />
        <Route path="/recetas" render={() => (
          this.state.isAuthenticated ?
            <ProductList type="recetas" name="Recetas" /> :
            <Redirect to='/' />
        )} />
      </div>
    );
  }
}

export default Main;
