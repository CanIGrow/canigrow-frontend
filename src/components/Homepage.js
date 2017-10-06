import React, { Component } from 'react';
import '../styles/App.css';
import request from 'superagent';

export default class Homepage extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchbartext: "",
      zipcode: "",
    }
  }
  submitForm = (event) => {
    event.preventDefault();
  }
  componentDidMount(){
    request
      .get(`https://freegeoip.net/json/`)
      .end((err,res)=>{
        if (res !== undefined){
          this.setState({zipcode: res.body.zip_code});
        }
      })
  }
  handleTextChange = (event) => {
    event.preventDefault();
    if (this.state[event.target.id] !== undefined){
      this.setState({[event.target.id]: event.target.value , fireRedirect: false}, ()=>{
        //Here is an example that does the callback function after setstate is done
      });
    }
  }
  render() {
    return (
      <div className="homepage-container main-component-container">
        <form onSubmit={this.submitForm}>
          <div className="homepage-search-container container">
            <div className="pagination-centered text-center">
              <h2 className="homepage-search-title">Can I Grow...
              <input type="search" id="searchbartext"
                value={this.state.searchbartext}
                onChange={this.handleTextChange}
                className="homepage-search-box"/>
              </h2>
            </div>
          </div>
          <p className="pagination-centered text-center">zip code
          <input type="search" id="zipcode"
            value={this.state.zipcode}
            onChange={this.handleTextChange}
            className="homepage-search-box"/>
          </p>
          <h1 className="text-center">Dynamic Test<br/>{this.state.searchbartext}</h1>
        </form>
        <h1>This is a Homepage</h1>
      </div>
    );
  }
}
