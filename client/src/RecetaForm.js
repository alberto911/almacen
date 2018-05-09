import React, { Component } from 'react';
import UnitSelect from './UnitSelect';
import CategorySelect from './CategorySelect';
import Ingredients from './Ingredients';
import { formToJSON, compare, isNumeric } from './helper';

class RecetaForm extends Component {
  constructor(props) {
    super(props);
    this.form = React.createRef();
    this.addIngredient = this.addIngredient.bind(this);
    this.removeIngredient = this.removeIngredient.bind(this);
    this.sendForm = this.sendForm.bind(this);
    this.state = {
      ingredients: []
    }
  }

  componentDidMount() {
    if (this.props.edit) {
      for (var element of this.form.current.elements) {
        element.value = this.props.product[element.name];
      }
      this.setState({ ingredients: this.props.product.ingredientes.slice() });
    }
  }

  sendForm(e) {
    e.preventDefault();
    var object = formToJSON(e.target, false);
    object.ingredientes = this.state.ingredients.map(i => ({id: i.id, cantidad: i.cantidad}));
    e.target.reset();
    this.props.createProduct(JSON.stringify(object));
    this.setState({ ingredients: [] });
  }

  addIngredient(ingredient) {
    if (this.state.ingredients.find(i => i.id === ingredient.id))
      return;
    if (!isNumeric(ingredient.cantidad) || ingredient.cantidad <= 0)
      return;
    delete ingredient.categoria;
    this.setState((prevState) => (
      { ingredients: prevState.ingredients.concat(ingredient) }
    ));
  }

  removeIngredient(id) {
    const index = this.state.ingredients.indexOf(this.state.ingredients.find(i => String(i.id) === id));
    if (index > -1)
      this.setState((prevState) => {
        prevState.ingredients.splice(index, 1);
        return { ingredients: prevState.ingredients };
      });
  }

  render() {
    return (
      <div class="receta">
        {this.props.edit ? <h2>Editar {this.props.product.nombre}</h2> : <h2>Agregar receta</h2>}
        <form id="recetaForm" onSubmit={this.sendForm} ref={this.form}>
          <label class="float" htmlFor="nombre">Nombre: </label>
          <input class="addR" type="text" required id="nombre" name="nombre"></input><br />
          <label class="float" htmlFor="cantidad">Cantidad: </label>
          <input class="addR" type="text" required id="cantidad" name="cantidad" size="4"></input> <UnitSelect /><br />
          <label class="float" htmlFor="diasCaducidad">Días para caducar: </label>
          <input class="addR" type="text" required id="diasCaducidad" name="diasCaducidad" size="4"></input><br />
          <button class="btn">Guardar receta</button><br /><br />
        </form>

        <Ingredients ingredients={this.state.ingredients} removeIngredient={this.removeIngredient} />
        <IngredientForm addIngredient={this.addIngredient} />
      </div>
    );
  }
};

class IngredientForm extends Component {
  constructor(props) {
    super(props);
    this.onSelectCategory = this.onSelectCategory.bind(this);
    this.changeUnit = this.changeUnit.bind(this);
    this.sendForm = this.sendForm.bind(this);
    this.state = {
      products: [],
      unit: '',
      name: ''
    };
  }

  sendForm(e) {
    e.preventDefault();
    var ingredient = formToJSON(e.target, false);
    e.target.reset();
    this.props.addIngredient(ingredient);
    this.setState({ unit: '', name: '' });
  }

  onSelectCategory(e) {
    const category = e.target.value;
    fetch(`/api/materiasprimas/categoria/${category}`, { credentials: 'include' })
      .then(res => res.json())
      .then(products => products.sort(compare))
      .then(products => this.setState({ products: products, unit: '' }))
      .catch(error => console.error(error));
  }

  changeUnit(e) {
    const id = e.target.value;
    if (!id) {
      this.setState({ unit: '', name: '' });
      return;
    }
    const product = this.state.products.find(p => String(p.id) === id);
    this.setState({ unit: product.unidad, name: product.nombre });
  }

  render() {
    return (
      <div>
        <form id="ingredientForm" onSubmit={this.sendForm}>
          <CategorySelect onChange={this.onSelectCategory}/>
          <label htmlFor="id">Ingrediente: </label>
          <select required name="id" id="id" defaultValue="" onChange={this.changeUnit}>
            <option value="">Selecciona</option>
            {this.state.products.map(product =>
              <option key={product.id} value={product.id}>{product.nombre}</option>
            )}
          </select><br />

          <label class="float" htmlFor="cantidad">Cantidad: </label>
          <input class="addR" type="text" required id="cantidad" name="cantidad" size="4" placeholder="Cantidad"></input> {this.state.unit}<br />
          <input type="text" hidden id="unidad" name="unidad" value={this.state.unit}></input>
          <input type="text" hidden id="nombre" name="nombre" value={this.state.name}></input>
          <button class="btn">Agregar ingrediente</button>
        </form>
      </div>
    );
  }
};

export default RecetaForm;
