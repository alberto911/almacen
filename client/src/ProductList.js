import React, { Component } from 'react';
import { Link, Route, withRouter, Switch } from 'react-router-dom';
import ProductDetails from './ProductDetails';
import MateriaPrimaForm from './MateriaPrimaForm';
import RecetaForm from './RecetaForm';
import CategorySelect from './CategorySelect';
import Summary from './Summary';
import { compare } from './helper';
import './ProductList.css';

const Product = (product) => (
  <div>
    <Link to={`/${product.type}/${product.id}`}class="prodLink">
      <h4>{product.nombre}</h4>
    </Link>
  </div>
);

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.loadProducts = this.loadProducts.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.state = {
      products: [],
      category: ''
    };
  }

  loadProducts() {
    var url = `/api/${this.props.type}`;
    if (this.state.category)
      url += `/categoria/${this.state.category}`;
    fetch(url, {credentials: 'include'})
      .then(res => res.json())
      .then(products => products.sort(compare))
      .then(products => this.setState({ products: products }))
      .catch(error => console.error(error));
  }

  componentDidMount() {
    this.loadProducts();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.category !== prevState.category)
      this.loadProducts();
  }

  changeFilter(e) {
    this.setState({ category: e.target.value });
  }

  createProduct(json, id='', method='POST') {
    fetch(`/api/${this.props.type}/${id}`, {
      method: method,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: json
    })
      .then(this.loadProducts)
      .catch(error => console.error(error));
  }

  deleteProduct(id, history) {
    if (window.confirm("¿Estás seguro?")) {
      fetch(`/api/${this.props.type}/${id}`, { method: 'DELETE', credentials: 'include' })
        .then(res => res.json())
        .then(id => {
          history.push('/' + this.props.type);
          const index = this.state.products.indexOf(this.state.products.find(p => String(p.id) === id));
          if (index > -1)
            this.setState((prevState) => {
              prevState.products.splice(index, 1);
              return { products: prevState.products };
            });
        })
        .catch(error => console.error(error));
    }
  }

  render() {
    return (
      <div>
        <div className="sidenav">
            <div class="inicio">
            <Link to={'/'} class="btn-home">
              <p><i class="fas fa-arrow-alt-circle-left"></i>  {'Inicio'}</p>
            </Link>
        </div>
            <div class="contentNav">
              <Link to={`/${this.props.type}`} className="title">
                <h1>{this.props.name}</h1>
              </Link>
              <AddProductButon type={this.props.type} />
              {this.props.type === 'materiasprimas' && <CategorySelect filter={true} onChange={this.changeFilter}/>}
              {this.state.products.map(product =>
                  <div class="productCard">
                      <Product key={product.id} type={this.props.type} {...product} />
                  </div>
              )}
            </div>
        </div>
        <div className="main">
            <div class="contentPL">
              <Switch>
                <Route exact={true} path={`/${this.props.type}`} render={() => (
                  <Summary type={this.props.type} />
                )} />
                <Route exact={true} path={`/${this.props.type}/new`} render={() => (
                  this.props.type === 'materiasprimas' ?
                    <MateriaPrimaForm createProduct={this.createProduct} /> :
                    <RecetaForm createProduct={this.createProduct} />
                )} />
                <Route path={`/${this.props.type}/:productId`} render={({ match }) => (
                  <ProductDetails id={match.params.productId} deleteProduct={this.deleteProduct} createProduct={this.createProduct} type={this.props.type} />
                )} />
              </Switch>
            </div>
        </div>
      </div>
    );
  }
}

const AddProductButon = withRouter((props) => {
  var onClick = () => props.history.push(`/${props.type}/new`);
  return <button class="btn-add" onClick={onClick}>Agregar</button>;
});

export default ProductList;
