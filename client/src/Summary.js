import React, { Component } from 'react';
import { round, formatDate } from './helper';

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      cost: null
    };
  }

  componentDidMount() {
    var url = `/api/${this.props.type}/`;
    var caducar = fetch(url + 'caducar').then(res => res.json());
    var costo = fetch(url + 'costo').then(res => res.json());
    var promises = [caducar, costo];
    Promise.all(promises)
      .then(([products, cost]) => this.setState({ products: products, cost: cost.costo }))
      .catch(error => console.error(error));
  }

  render() {
    return (
      <div>
        <h1>Resumen del almacén</h1>
        {this.state.cost && <p>Costo total: ${round(this.state.cost, 2)}</p>}
        <h3>Productos próximos a caducar</h3>
        <ul>
          {this.state.products.map(product =>
            <li key={product.id}>
              {product.nombre}: {round(product.cantidad, 3)} {product.unidad}, caduca {formatDate(product.fechaCaducidad)}
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default Summary;
