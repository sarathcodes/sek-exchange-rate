import React, { Component } from 'react';
import { getCookie, setCookie } from './utils/cookie';
import Login from './components/login';
import CountryList from './components/countryList';

import './app.css';

export default class App extends Component {
  state = { loggedIn: false, loading: true };

  constructor(props) {
    super(props);
    this.validateLogin = this.validateLogin.bind(this);
  }

  componentDidMount() {
    const authCookie = getCookie('auth');
    fetch('/auth/me', {
      headers: {
        'x-access-token': getCookie('auth')
      }
    })
      .then(res => res.json())
      .then((user) => {
        if (user.id) {
          this.setState({ user: { id: user.id, name: user.name, auth: authCookie }, loggedIn: true, loading: false });
        } else {
          this.setState({ loading: false });
        }
      });
  }

  validateLogin({ email, password }) {
    this.setState({ loading: true });
    fetch('/auth/login', {
      method: 'POST',
      body: new URLSearchParams({
        email,
        password
      })
    })
      .then(res => res.json())
      .then((user) => {
        if (user.auth) {
          this.setState({ loggedIn: true, user: { id: user.id, name: user.name, auth: user.token }, loading: false });
          setCookie('auth', user.token);
        } else {
          this.setState({ loggedIn: false, loading: false, errorMessageInLogin: user.message });
        }
      });
  }

  render() {
    const {
      loggedIn, user, loading, errorMessageInLogin
    } = this.state;
    if (loading) {
      return <div className="spinner" />;
    }
    return (
      <div>
        {loggedIn
          ? <CountryList user={user} />
          : <Login validateLogin={this.validateLogin} errorMessageInLogin={errorMessageInLogin} />}
      </div>
    );
  }
}
