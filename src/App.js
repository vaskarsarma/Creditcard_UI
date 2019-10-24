import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

const initialState = {
  title: 'Creadit Card System',
  url: "http://localhost:3001/card",
  cardNameValidationError: "",
  cardNumberValidationError: "",
  cardLimitValidationError: "",
  cardHolderName: "",
  cardNumber: "",
  cardLimit: ""
}

let isValid = true;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      data: []
    }
  }

  componentDidMount() {
    axios.get(this.state.url)
      .then(res => {
        if (res) {
          this.setState({ data: res.data });
        }
      })
    //this.refs.cardHolderName.focus();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isValidForm()) {

      let cardHolderName= this.state.cardHolderName;
      let cardNumber= this.state.cardNumber;
      let cardLimit= this.state.cardLimit;

      let cardData={
        "cardHolderName": cardHolderName.toString(),
        "cardNumber": cardNumber.toString(),
        "cardLimit": cardLimit.toString()
      }

      axios.post(this.state.url + "/add", cardData,
      { headers: { 'Content-Type': 'application/json' }})
      .then(res => {
          if (res.data.status === "success") {
            let data=this.state.data;
            data.push(res.data.data);
            this.setState({
              ...initialState,
              data: data
            });
            this.refs.ccFrom.reset();
            //this.refs.cardHolderName.focus();
          }
          else
          {
            this.setState({
              cardNumberValidationError: "Please add a valid card number"
            });
            this.refs.cardNumber.focus();
          }
        })
    }
    else {
      return;
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: [e.target.value]
    })

    this.isValidForm();
  }

  isValidForm() {
    isValid = true;
    if (!this.refs.cardHolderName.value) {
      isValid = false;
      this.setState({
        cardNameValidationError: "Please enter card holder name"
      })
    } else if (this.refs.cardHolderName.value.match("^[a-zA-Z][a-zA-Z ]{2,100}$") == null) {
      isValid = false;
      this.setState({
        cardNameValidationError: "Name can have only alphabates."
      })
    } else {
      this.setState({
        cardNameValidationError: ""
      })
    }

    if (!this.refs.cardNumber.value) {
      isValid = false;
      this.setState({
        cardNumberValidationError: "Please enter card number"
      })
    } else if (this.refs.cardNumber.value.match("^[0-9][0-9 ]{15,19}$") == null) {
      isValid = false;
      this.setState({
        cardNumberValidationError: "Only number allowed.Max allowed 19 characters."
      })
    } else {
      this.setState({
        cardNumberValidationError: ""
      })
    }

    if (!this.refs.cardLimit.value) {
      isValid = false;
      this.setState({
        cardLimitValidationError: "Please enter card limit"
      })
    } else if (this.refs.cardLimit.value.match("^[0-9]{1,10}$") == null) {
      isValid = false;
      this.setState({
        cardLimitValidationError: "Only number allowed. Max allowed 10 digits."
      })
    } else {
      this.setState({
        cardLimitValidationError: ""
      })
    }

    return isValid;
  }

  render() {
    let data = this.state.data;
    return (
      <div className="App">
        <div className="container">
          <div className="row"><h3>Credit Card System</h3></div>
          <div className="row"><h4>Add</h4></div>
          <div className="row">
            <form className="form-horizontal ccForm" ref="ccFrom">
              <div className="form-group">
                <label className="control-label formText" htmlFor="cardHolderName">Name</label>
                <input type="text" className="form-control" name="cardHolderName" id="cardHolderName" ref="cardHolderName" value={this.state.cardHolderName}
                  onChange={this.handleChange} maxLength="100"></input>
                {this.state.cardNameValidationError !== "" ? <span className="errorLabel">{this.state.cardNameValidationError}</span> : null}
              </div>
              <div className="form-group">
                <label className="control-label formText" htmlFor="cardNumber">Card Number</label>
                <input type="text" className="form-control" name="cardNumber" id="cardNumber" ref="cardNumber" value={this.state.cardNumber}
                  onChange={this.handleChange} maxLength="19"></input>
                {this.state.cardNumberValidationError !== "" ? <span className="errorLabel">{this.state.cardNumberValidationError}</span> : null}
              </div>
              <div className="form-group">
                <label className="control-label formText" htmlFor="cardLimit">Limit</label>
                <input type="text" className="form-control" name="cardLimit" id="cardLimit" ref="cardLimit"
                  value={this.state.cardLimit} onChange={this.handleChange} maxLength="10" ></input>
                {this.state.cardLimitValidationError !== "" ? <span className="errorLabel">{this.state.cardLimitValidationError}</span> : null}
              </div>
              <div className="form-group">
                <button type="submit" className="btn-sm col-xs-6 col-sm-6" onClick={(e) => this.handleSubmit(e)}>Add</button>
              </div>
            </form>
          </div>
        </div>

        <div className="container">
          <div className="row"><h4>Existing Cards</h4></div>
          <div className="row">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="formText">Name</th>
                    <th className="formText">Card Number</th>
                    <th className="formText">Balance</th>
                    <th className="formText">Limit</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (data.map((card, i) =>
                    <tr key={i}>
                      <td className="formText">{card.cardHolderName}</td>
                      <td className="formText">{card.cardNumber}</td>
                      <td className="formText">{card.balance}</td>
                      <td className="formText">£-{card.cardLimit}</td>
                    </tr>
                  )
                  )
                    :
                    <tr>
                      <td colSpan="4">No Data Available</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
