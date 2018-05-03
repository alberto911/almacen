import React, { Component } from 'react';
import ProductList from './ProductList';
import { BrowserRouter as Router, Route } from 'react-router-dom';
//import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route path={`/materiasprimas`} render={() => (
            <ProductList type="materiasprimas" name="Materias primas"/>
          )} />
          <Route path={`/recetas`} render={() => (
            <ProductList type="recetas" name="Recetas"/>
          )} />
        </div>
      </Router>
    );
  }
}

export default App;
