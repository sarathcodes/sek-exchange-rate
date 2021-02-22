import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { numberWithCommas } from '../utils/number';

let timeOut = null;
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestionList: [], userCountryList: [], itemToAdd: null, amountInSEK: 0, conversionRate: {}
    };

    // event bindings
    this.handleCountryInputChange = this.handleCountryInputChange.bind(this);
    this.handleChangeInAmount = this.handleChangeInAmount.bind(this);
    this.addToList = this.addToList.bind(this);
  }

  componentDidMount() {
    const { user } = this.props;
    fetch('/api/location/conversionRate', {
      headers: {
        'x-access-token': user.auth
      }
    })
      .then(res => res.json())
      .then((data) => {
        if (data.status === 'success') {
          this.setState({ conversionRate: data.response });
        }
      });
  }

  handleCountryInputChange(event) {
    const input = event.target.value;
    this.setState({ itemToAdd: null });
    if (input.length <= 2) {
      return;
    }
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      this.updateSuggestion(input);
    }, 300);
  }

  handleChangeInAmount(event) {
    const amount = parseFloat(event.target.value);
    this.setState({ amountInSEK: amount });
  }

  updateSuggestion(countryName) {
    const { user } = this.props;
    fetch(`/api/location/lookup?name=${encodeURIComponent(countryName)}`, {
      headers: {
        'x-access-token': user.auth
      }
    })
      .then(res => res.json())
      .then((data) => {
        if (data.response && data.response.length) {
          let itemToAdd = null;
          data.response.forEach((item) => {
            if (item.name.toLowerCase() === countryName.toLowerCase()) {
              itemToAdd = item;
            }
          });
          this.setState({ suggestionList: data.response, itemToAdd });
        } else {
          this.setState({ suggestionList: [], itemToAdd: null });
        }
      });
  }

  addToList() {
    const { itemToAdd, userCountryList } = this.state;
    if (itemToAdd) {
      userCountryList.push(itemToAdd);
    }
    this.setState({ userCountryList });
  }

  renderCountryDataList() {
    const { suggestionList } = this.state;
    return (
      <datalist id="datalist-country-list">
        {suggestionList.map(item => <option key={`country-${item.alpha3Code}`}>{item.name}</option>)}
      </datalist>
    );
  }

  renderCountryTable() {
    const { userCountryList, amountInSEK = 0, conversionRate } = this.state;
    if (userCountryList.length === 0) {
      return <h2>Please add a country to view exchange rate</h2>;
    }
    return (
      <div className="tbl-content">
        <table cellPadding="0" cellSpacing="0" border="0">
          <tbody>
            {userCountryList.map(item => (
              <tr>
                <td>{item.name}</td>
                <td>{item.currencies[0].name}</td>
                <td>{numberWithCommas(item.population)}</td>
                <td>
                  {`${item.currencies[0].symbol} ${numberWithCommas(
                    (amountInSEK * conversionRate[item.currencies[0].code]).toFixed(2)
                  )}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    const { itemToAdd } = this.state;
    return (
      <main className="main">
        <section className="container country-container">
          <h1>SEK Exchange Rate</h1>
          <form name="countrySelector" className="form country-selector">
            <input
              type="text"
              className="input-field"
              autoComplete="on"
              list="datalist-country-list"
              placeholder="Enter country name"
              onChange={this.handleCountryInputChange}
            />
            {this.renderCountryDataList()}
            <input
              type="button"
              name="submit"
              className="input-submit color-blue"
              disabled={!itemToAdd}
              value="Add To List"
              onClick={this.addToList}
            />
            <input
              type="text"
              className="input-field float-right text-right"
              placeholder="Enter Amount in SEK"
              onChange={this.handleChangeInAmount}
            />
          </form>
          <div className="tbl-header">
            <table cellPadding="0" cellSpacing="0" border="0">
              <thead>
                <tr>
                  <th>Country Name</th>
                  <th>Currency</th>
                  <th>Population</th>
                  <th>Conversion Amount</th>
                </tr>
              </thead>
            </table>
          </div>
          {this.renderCountryTable()}
        </section>
      </main>
    );
  }
}

Login.propTypes = {
  user: PropTypes.object.isRequired
};
