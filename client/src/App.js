import React, { Component } from 'react';
import ProductList from './ProductList';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
//import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact={true} path={'/'} render={() => (
            <div>
              <h1>Bienvenido</h1>
              <h3>Selecciona un almacén</h3>
              <Link to={'/materiasprimas'}>
                <h4>Materias primas</h4>
              </Link>
              <Link to={'/recetas'}>
                <h4>Productos elaborados</h4>
              </Link>
            </div>
          )} />
          <Route path={'/materiasprimas'} render={() => (
            <ProductList type="materiasprimas" name="Materias primas"/>
          )} />
          <Route path={'/recetas'} render={() => (
            <ProductList type="recetas" name="Recetas"/>
          )} />
        </div>
      </Router>
    );
  }
}

export default App;
