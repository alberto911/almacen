import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { formToJSON, formatDate, round } from './helper.js';
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
    this.texts = {
      materiasprimas: {
        info: MateriaPrimaInfo,
        form: MateriaPrimaForm,
        instance_text: 'Instancias',
        no_instance_text: 'Este producto no tiene instancias',
      },
      recetas: {
        info: RecetaInfo,
        form: RecetaForm,
        instance_text: 'Productos elaborados',
        no_instance_text: 'No hay productos elaborados',
      }
    }
  }

  loadProduct() {
    fetch(`/api/${this.props.type}/${this.props.id}`, { credentials: 'include' })
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
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: json
    })
      .then(this.loadProduct)
      .catch(error => console.error(error));
  }

  deleteInstance(iid) {
    fetch(`/api/${this.props.type}/${this.props.id}/instancias/${iid}`, { method: 'DELETE', credentials: 'include' })
      .then(this.loadProduct)
      .catch(error => console.error(error));
  }

  render() {
    if (!this.state.product)
      return null;
    const Info = this.texts[this.props.type].info;
    const Form = this.texts[this.props.type].form;

    return (
      <div>
        {!this.state.edit ?
          <div class="details">
            <h2>{this.state.product.nombre}</h2>
            <DeleteButton deleteProduct={this.props.deleteProduct} id={this.props.id} />
            <button class="btn" onClick={() => this.setState({ edit: true })}>Editar</button>
            <Info product={this.state.product} />

            <Instances
              instance_text={this.texts[this.props.type].instance_text}
              no_instance_text={this.texts[this.props.type].no_instance_text}
              instances={this.state.product.instancias}
              unidad={this.state.product.unidad}
              deleteInstance={this.deleteInstance}
            />
            <InstanceForm type={this.props.type} createInstance={this.createInstance} unidad={this.state.product.unidad}/>
          </div>
          : <Form product={this.state.product} edit={true} createProduct={this.sendForm} />
        }
      </div>
    );
  }
}

const DeleteButton = withRouter((props) => (
  <button class="btn" onClick={() => props.deleteProduct(props.id, props.history)}>Eliminar</button>
));

const InstanceForm = (props) => (
  <div>
    <h4>{props.type === 'materiasprimas' ? 'Agregar instancia' : 'Preparar receta'}</h4>
    <form onSubmit={props.createInstance}>
      <label htmlFor="cantidad">Cantidad: </label>
      <input type="text" required id="cantidad" name="cantidad" size="4"></input> {props.unidad}<br />
      {props.type === 'materiasprimas' &&
        <div>
          <label htmlFor="fechaCaducidad">Fecha de caducidad: </label>
          <input type="date" required id="fechaCaducidad" name="fechaCaducidad"></input>
        </div>
      }
      <button class="btn">Crear</button>
    </form>
  </div>
);

const Instances = (props) => (
  props.instances ? (
    <div>
      <h4>{props.instance_text}</h4>
      <ul>
        {props.instances.map(instance =>
          <li key={instance.id}>
            {round(instance.cantidad, 3)} {props.unidad}, caduca {formatDate(instance.fechaCaducidad)} (${round(instance.costo, 2)})
            &emsp; <button onClick={() => props.deleteInstance(instance.id)}>Borrar</button>
          </li>
        )}
      </ul>
      <p>Costo total del producto: ${round(props.instances.map(i => i.costo).reduce((total, i) => total + i), 2)}</p>
    </div>
  ) : <h4>{props.no_instance_text}</h4>
);

export default ProductDetails;
