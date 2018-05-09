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
          <button class="btn-lgout" onClick={this.logout}>Log out</button>
          <div class="header">
              <h1>Bienvenido {this.props.username}</h1>
              <h3>Selecciona un almacén</h3>
          </div>
          <div class="navbar">
                <Link to={'/materiasprimas'}>
                    <h4>Materias primas</h4>
                </Link>
                <Link to={'/recetas'}>
                    <h4>Productos elaborados</h4>
                </Link>
            </div>
            <div class="content">
                Este es el sistema de miComidita S.A. desde aquí tienes acceso a dos tipos de almacenes uno de materias primas y otro de producto elaborado.
                <br/><br/>
                En este sistema se pueden crear, ver, alterar y borrar recetas, materia prima y productos elaborados.
                <br/><br/>
                Esperemos les sea útil el sistema.
            </div>
            <div class="footer">
                Abril 2018
            </div>
      </div>
    );
  }
}

export default Home;
