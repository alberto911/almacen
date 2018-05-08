import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout() {
    fetch('/logout', { credentials: 'include' })
      .then(() => this.props.updateCredentials(false, ''))
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div>
        <h1>Bienvenido {this.props.username}</h1>
        <h3>Selecciona un almacén</h3>
        <Link to={'/materiasprimas'}>
          <h4>Materias primas</h4>
        </Link>
        <Link to={'/recetas'}>
          <h4>Productos elaborados</h4>
        </Link>
        <button onClick={this.logout}>Log out</button>
      </div>
    );
  }
}

export default Home;
