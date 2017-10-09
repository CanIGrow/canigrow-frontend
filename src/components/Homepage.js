import React, { Component } from 'react';
import '../styles/App.css';
import request from 'superagent';

export default class Homepage extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchbartext: "",
      zipcode: "",
      allplantdata: false,
      filteredplantdata: false
    }
    this.filterlist = this.filterlist.bind(this);
  }
  submitForm = (event) => {
    event.preventDefault();
  }
  componentDidMount(){
    const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
    request
      .get(`https://freegeoip.net/json/`)
      .end((err,res)=>{
        if (res !== undefined){
          this.setState({zipcode: res.body.zip_code});
          request
            .get(`${proxyurl}https://canigrow.herokuapp.com/api/plants/`)
            .end((err,res)=>{
              if (res !== undefined){
                let plantsarray = [];
                res.body.plants.map((x, i) =>{
                  if (x.common_name !== null){
                    plantsarray.push(x);
                  }
                })
                this.setState({ allplantdata:plantsarray }, ()=>{
                  console.log("DONE");
                });
              }
            })
        }
      })
  }
  filterlist(letter){
    let list = this.state.allplantdata;
    if (this.state.filteredplantdata){
      // list = list.map((x, i)=>{
      //   console.log(x.common_name);
      // })
      list = list.filter(function(item){
        return item.common_name.toLowerCase().search(
          letter.toLowerCase()) !== -1;
      });
    }
    this.setState({filteredplantdata: list});
  }
  handleTextChange = (event) => {
    event.preventDefault();
    let value = event.target.value;
    if (this.state[event.target.id] !== undefined){
      this.setState({[event.target.id]: event.target.value , fireRedirect: false}, ()=>{
        if (this.state.searchbartext.length && this.state.allplantdata){
          this.filterlist(value);
        }
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
