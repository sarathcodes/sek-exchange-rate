import React, { Component } from 'react';
import PropTypes from 'prop-types';

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: null };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.validateUser = this.validateUser.bind(this);
  }

  handleInputChange(event) {
    const { target: { name, value } } = event;

    this.setState({
      [name]: value,
      error: null
    });
  }

  validateUser() {
    const { email, password } = this.state;
    const { validateLogin } = this.props;
    if (validateEmail(email)) {
      validateLogin({ email, password });
    } else {
      this.setState({ error: 'Invalid email' });
    }
  }

  render() {
    const { error } = this.state;
    const { errorMessageInLogin } = this.props;
    return (
      <main className="main">
        <div className="container">
          <section className="wrapper">
            <div className="heading">
              <h1 className="text text-large">Sign In</h1>
            </div>
            <form name="login" className="form">
              <div className="input-control">
                <input type="email" name="email" className="input-field" placeholder="Email Address" onChange={this.handleInputChange} />
              </div>
              <div className="input-control">
                <input type="password" name="password" className="input-field" placeholder="Password" onChange={this.handleInputChange} />
              </div>
              <div className="input-control">
                <input type="button" name="submit" className="input-submit" value="Login" onClick={this.validateUser} />
              </div>
              {error || errorMessageInLogin ? <span className="text-normal error">{error || errorMessageInLogin}</span> : null}
            </form>
          </section>
        </div>
      </main>
    );
  }
}

Login.defaultProps = {
  errorMessageInLogin: ''
};

Login.propTypes = {
  validateLogin: PropTypes.func.isRequired,
  errorMessageInLogin: PropTypes.string
};
