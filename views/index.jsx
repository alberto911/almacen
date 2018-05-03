var React = require('react');

class HelloMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }

  render() {
    return (
      <div className="App">
        <h1>Users</h1>
        {this.state.users.map(user =>
          <div key={user.id}>{user.username}</div>
        )}
      </div>
    );
  }
}

/*class App extends React.Component {
  state = {users: []}

  componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(users => this.setState({ users }));
    this.setState({users: [{
    	id: 1,
    	username: "samsepi0l"
    }, {
    	id: 2,
    	username: "D0loresH4ze"
    }]});
  }

  render() {
    return (
      <div className="App">
        <h1>Users</h1>
        {this.state.users.map(user =>
          <div key={user.id}>{user.username}</div>
        )}
      </div>
    );
  }
}

module.exports = App;*/

module.exports = HelloMessage;
