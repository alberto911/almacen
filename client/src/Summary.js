import React, { Component } from 'react';
import { round, formatDate } from './helper';

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      cost: null,
      perdidas: null
    };
  }

  componentDidMount() {
    var url = `/api/${this.props.type}/`;
    var caducar = fetch(url + 'caducar', { credentials: 'include' }).then(res => res.json());
    var costo = fetch(url + 'costo', { credentials: 'include' }).then(res => res.json());
    var perdidas = fetch(url + 'costo-caducados', { credentials: 'include' }).then(res => res.json());
    var promises = [caducar, costo, perdidas];
    Promise.all(promises)
      .then(([products, cost, perdidas]) =>
        this.setState({ products: products, cost: cost.costo, perdidas: perdidas.costo }))
      .catch(error => console.error(error));
  }

  render() {
    return (
      <div>
        <h1>Resumen del almacén</h1>
        {this.state.cost && <p>Costo total: ${round(this.state.cost, 2)}</p>}
        {this.state.perdidas && <p>Pérdidas por productos caducados: ${round(this.state.perdidas, 2)}</p>}
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
