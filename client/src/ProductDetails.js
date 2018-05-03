import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { formToJSON, formatDate } from './helper.js';
import MateriaPrimaForm from './MateriaPrimaForm';
import RecetaForm from './RecetaForm';
import MateriaPrimaInfo from './MateriaPrimaInfo';
import RecetaInfo from './RecetaInfo';

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.createInstance = this.createInstance.bind(this);
    this.deleteInstance = this.deleteInstance.bind(this);
    this.loadProduct = this.loadProduct.bind(this);
    this.sendForm = this.sendForm.bind(this);
    this.state  = {
      product: null,
      edit: false,
      currId: this.props.id
    };
  }

  loadProduct() {
    fetch(`/api/${this.props.type}/${this.props.id}`)
      .then(res => res.json())
      .then(product => this.setState({ product: product }))
      .catch(error => console.error(error));
  }

  componentDidMount() {
    this.loadProduct();
  }

  componentDidUpdate(prevProps, prevState) {
    if(!this.state.product)
      this.loadProduct();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.id !== prevState.currId) {
      return {
        product: null,
        currId: nextProps.id,
        edit: false
      };
    }
    return { edit: false };
  }

  sendForm(json) {
    this.props.createProduct(json, this.props.id, 'PUT');
    this.setState({ product: null, edit: false });
  }

  createInstance(e) {
    e.preventDefault();
    const json = formToJSON(e.target);
    e.target.reset();

    fetch(`/api/${this.props.type}/${this.props.id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: json
    })
      .then(this.loadProduct)
      .catch(error => console.error(error));
  }

  deleteInstance(iid) {
    fetch(`/api/${this.props.type}/${this.props.id}/instancias/${iid}`, { method: 'DELETE' })
      .then(this.loadProduct)
      .catch(error => console.error(error));
  }

  render() {
    if (!this.state.product)
      return null;
    return (
      <div>
        {!this.state.edit ?
          <div>
            <h2>{this.state.product.nombre}</h2>
            <DeleteButton deleteProduct={this.props.deleteProduct} id={this.props.id} />
            <button onClick={() => this.setState({ edit: true })}>Editar</button>
            {this.props.type === 'materiasprimas' ?
              <MateriaPrimaInfo product={this.state.product} /> :
              <RecetaInfo receta={this.state.product} />
            }
            {this.state.product.instancias ?
              <Instances instances={this.state.product.instancias} unidad={this.state.product.unidad} deleteInstance={this.deleteInstance} />
              : <h4>Este producto no tiene instancias</h4>
            }

            <h4>Agregar instancia</h4>
            <InstanceForm createInstance={this.createInstance} unidad={this.state.product.unidad}/>
          </div>
          : this.props.type === 'materiasprimas' ?
              <MateriaPrimaForm product={this.state.product} edit={true} createProduct={this.sendForm} /> :
              <RecetaForm product={this.state.product} edit={true} createProduct={this.sendForm} />
        }
      </div>
    );
  }
}

const DeleteButton = withRouter((props) => (
  <button onClick={() => props.deleteProduct(props.id, props.history)}>Eliminar</button>
));

const InstanceForm = (props) => (
  <div>
    <form onSubmit={props.createInstance}>
      <label htmlFor="cantidad">Cantidad: </label>
      <input type="text" required id="cantidad" name="cantidad" size="4"></input> {props.unidad}<br />
      <label htmlFor="fechaCaducidad">Fecha de caducidad: </label>
      <input type="date" required id="fechaCaducidad" name="fechaCaducidad"></input>
      <button>Insertar</button>
    </form>
  </div>
);

const Instances = (props) => (
  <div>
    <h4>Instancias</h4>
    <ul>
      {props.instances.map(instance =>
        <li key={instance.id}>
          {instance.cantidad} {props.unidad}, caduca {formatDate(instance.fechaCaducidad)}
          &emsp; <button onClick={() => props.deleteInstance(instance.id)}>Borrar</button>
        </li>
      )}
    </ul>
  </div>
);

export default ProductDetails;
