import React, { Component } from 'react';
import '../styles/App.css';
import request from 'superagent';

export default class Homepage extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchbartext: "",
      zipcode: "",
      filteredplantdata: false,
    }
    this.filterlist = this.filterlist.bind(this);
  }
  submitForm = (event) => {
    event.preventDefault();
  }
  componentDidMount(){
    request
      .get(`https://freegeoip.net/json/`)
      .end((err,res)=>{
        if (res !== undefined){
          var today = new Date();
          today = today.getMonth()+1 + '/' + today.getDate();
          this.setState({zipcode: res.body.zip_code, date:today});
        }
      })
  }
  filterlist(letter){
    let list = this.props.allplantdata;
    if (this.state.filteredplantdata){
      list = list.filter(function(item){
        return item.common_name.toLowerCase().search(
          letter.toLowerCase()) !== -1;
      });
    }
    this.setState({filteredplantdata: list}, ()=>{
      console.log(this.state.filteredplantdata);
    });
  }
  handleTextChange = (event) => {
    event.preventDefault();
    let value = event.target.value;
    if (this.state[event.target.id] !== undefined){
      this.setState({[event.target.id]: event.target.value , fireRedirect: false}, ()=>{
        if (this.state.searchbartext.length && this.props.allplantdata){
          this.filterlist(value);
        }
      });
    }
  }
  render() {
    let searchResults = null;
    if (this.state.filteredplantdata){
      if (this.state.filteredplantdata.length > 50){
        searchResults =
          <div>
            <h3 className="text-center">
              There are currently {this.state.filteredplantdata.length} results... Please your search!
            </h3>
          </div>
      } else if (this.state.filteredplantdata.length <= 50) {
        searchResults = this.state.filteredplantdata.map((x, i) =>{
          console.log(x);
          return (
            <div key={x.plant_id}>
              <h4 className="text-center">
                Name: {x.common_name}
              </h4>
            </div>
          )
        })
      }
    }
    if (!this.props.allplantdata){
      searchResults =
        <div>
          <h3 className="text-center">
            Loading plant data...
          </h3>
        </div>
    }
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
          {searchResults ? searchResults : ""}
        </form>
      </div>
    );
  }
}
