import React, { Component } from 'react';
import '../styles/App.css';
import request from 'superagent';
import { Link } from 'react-router-dom';

export default class Homepage extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchbartext: "",
      zipcode: "",
      filteredplantdata: false,
      expandResults: false,
      zone: false,
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
          let today = new Date();
          let day = today.getDate();
          let season = false;
          let generalseason = false;
          switch (today.getMonth()+1) {
            case 1:
              if(day < 20){
                season = "Early-Winter"
              } else {
                season = "Mid-Winter"
              }
              generalseason = "Winter"
              break;
            case 2:
              if(day < 19){
                season = "Mid-Winter"
              } else {
                season = "Late-Winter"
              }
              generalseason = "Winter"
              break;
            case 3:
              if(day < 19){
                season = "Late-Winter";
                generalseason = "Winter";
              } else {
                season = "Early-Spring";
                generalseason = "Spring";
              }
              break;
            case 4:
              if(day < 20){
                season = "Early-Spring"
              } else {
                season = "Mid-Spring"
              }
              generalseason = "Spring"
              break;
            case 5:
              if(day < 21){
                season = "Mid-Spring"
              } else {
                season = "Late-Spring"
              }
              generalseason = "Spring"
              break;
            case 6:
              if(day < 20){
                season = "Late-Spring";
                generalseason = "Spring";
              } else {
                season = "Early-Summer";
                generalseason = "Summer";
              }
              break;
            case 7:
              if(day < 20){
                season = "Early-Summer";
              } else {
                season = "Mid-Summer";
              }
              generalseason = "Summer";
              break;
            case 8:
              if(day < 21){
                season = "Mid-Summer";
              } else {
                season = "Late-Summer";
              }
              generalseason = "Summer";
              break;
            case 9:
              if(day < 20){
                season = "Late-Summer";
                generalseason = "Summer";
              } else {
                season = "Early-Fall";
                generalseason = "Fall";
              }
              break;
            case 10:
              if(day < 21){
                season = "Early-Fall";
              } else {
                season = "Mid-Fall";
              }
              generalseason = "Fall";
              break;
            case 11:
              if(day < 21){
                season = "Mid-Fall";
              } else {
                season = "Late-Fall";
              }
              generalseason = "Fall";
              break;
            case 12:
              if(day < 20){
                season = "Late-Fall";
                generalseason = "Fall";
              } else {
                season = "Early-Winter";
                generalseason = "Winter";
              }
              break;
            default:
          }
          let fulldatedata = {
            date: today.getMonth()+1 + '/' + today.getDate(),
            season: season,
            generalseason: generalseason,
          }
          this.setState({zipcode: res.body.zip_code, date:fulldatedata}, ()=>{
            this.updateZip(this.state.zipcode);
          });
        }
      })
  }
  updateZip = (zip) => {
    request
      .get(`https://freegeoip.net/json/`)
      .end((err,res)=>{
        if (res !== undefined && this.state.zipcode.length > 3){
          const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
          request
            .post(`${proxyurl}https://canigrow.herokuapp.com/api/zones/get_zone/`)
            .send({"zip": this.state.zipcode})
            .end((err,res)=>{
              if (err){ return }
              if (res.body && res.body !== undefined && res.body.zone !== undefined){
                this.setState({zone:res.body.zone.zone});
              }
            });
        }
      })
  }
  filterlist(letter){
    let list = this.props.allplantdata;
    console.log(letter);
    if (this.props.allplantdata){
      list = list.filter(function(item){
        return item.common_name.replace(/\s\s+/g, ' ').replace(/\u00AC/g, '').replace(/\u00BB/g, "").replace(/\uFFE2/g, "").replace(/\u0021/g, "").replace(/\u003F/g, "").replace(/\uFF1B/g, "").replace(/\u003B/g, "").toLowerCase().search(
          letter.replace(/\s\s+/g, ' ').replace(/\u00AC/g, '').replace(/\u00BB/g, "").replace(/\uFFE2/g, "").replace(/\u0021/g, "").replace(/\u003F/g, "").replace(/\uFF1B/g, "").replace(/\u003B/g, "").toLowerCase()) !== -1;
      });
    }
    if (this.state.searchbartext.length > 1){
      this.setState({filteredplantdata: list});
    } else {
      this.setState({filteredplantdata: false});
    }
  }
  handleTextChange = (event) => {
    event.preventDefault();
    let value = event.target.value;
    if (this.state[event.target.id] !== undefined){
      this.setState({[event.target.id]: event.target.value , fireRedirect: false}, ()=>{
        if (this.props.allplantdata){
          this.filterlist(value);
        }
      });
    }
    if (event.target.id === "zipcode"){
      this.updateZip(value);
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
          let inlinelink = `/plants/${x.plant_id}`
          return (
            <div key={x.plant_id}>
              <h4 className="text-center">
                <Link to={inlinelink}>Home
                  Name: {x.common_name.replace(/\s\s+/g, ' ').replace(/\u00AC/g, '').replace(/\u00BB/g, "").replace(/\uFFE2/g, "").replace(/\u0021/g, "").replace(/\u003F/g, "").replace(/\uFF1B/g, "").replace(/\u003B/g, "")}
                </Link>
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
            className="homepage-search-box"/><br/>
          <span>
          Your USDA Cold Hardiness Zone: {this.state.zone}
          </span>
          </p>
          {searchResults ? searchResults : ""}
        </form>
      </div>
    );
  }
}
