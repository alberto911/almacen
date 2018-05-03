import React, { Component } from 'react';
import CategorySelect from './CategorySelect';
import UnitSelect from './UnitSelect';
import { formToJSON } from './helper.js';

class MateriaPrimaForm extends Component {
  constructor(props) {
    super(props);
    this.sendForm = this.sendForm.bind(this);
    this.form = React.createRef();
  }

  componentDidMount() {
    if (this.props.edit) {
      for (var element of this.form.current.elements) {
        element.value = this.props.product[element.name];
      }
      this.form.current.elements.categoria_anterior.value = this.props.product.categoria;
    }
  }

  sendForm(e) {
    e.preventDefault();
    const json = formToJSON(e.target);
    e.target.reset();
    this.props.createProduct(json);
  }

  render() {
    return (
      <div>
        {this.props.edit ? <h2>Editar {this.props.product.nombre}</h2> : <h2>Agregar materia prima</h2>}
        <form id="materiaPrimaForm" onSubmit={this.sendForm} ref={this.form}>
          <label htmlFor="nombre">Nombre: </label>
          <input type="text" required id="nombre" name="nombre"></input><br />
          <CategorySelect />
          {this.props.edit && <input type="text" hidden id="categoria_anterior" name="categoria_anterior"></input>}
          <label htmlFor="costo">Costo: $</label>
          <input type="text" required id="costo" name="costo" size="6"></input> por <
          input type="text" required id="cantidad" name="cantidad" size="4" placeholder="Cantidad"></input> <UnitSelect />
          <button>Enviar</button>
        </form>
      </div>
    );
  }
};

export default MateriaPrimaForm;
