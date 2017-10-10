import React, { Component } from 'react';
import '../styles/App.css';
import request from 'superagent';
import zipcodearray from './../zipcodes.json';
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
      zipzone: false,
      suggested: false,
      divisionsChecked: false,
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
  componentDidUpdate(prevProps, prevState){
    if (this.props.allplantdata !== prevProps.allplantdata){
      this.filterlist(false);
    }
  }
  updateZip = (zip) => {
    let zipzone = false
    zipcodearray.map((x, i) =>{
      if (x.zipcode === zip){
        zipzone = x.zone
        return
      }
    })
    if (zipzone && zipzone !== undefined){
      this.setState({zone:`Your USDA Cold Hardiness Zone: ${zipzone}`, zipzone:zipzone}, ()=>{
        this.filterlist(false);
      });
    } else if (zip.length === 5){
      this.setState({zone:`Invalid US Zipcode`});
    } else {
      this.setState({zone:`Please enter full zip code`});
    }
  }
  filterlist(searchbar, letter){
    let list = this.props.allplantdata;
    if (searchbar && this.props.allplantdata){
      list = list.filter(function(item){
        return item.common_name.replace(/\s\s+/g, ' ').replace(/\u00AC/g, '').replace(/\u00BB/g, "").replace(/\uFFE2/g, "").replace(/\u0021/g, "").replace(/\u003F/g, "").replace(/\uFF1B/g, "").replace(/\u003B/g, "").toLowerCase().search(
          letter.replace(/\s\s+/g, ' ').replace(/\u00AC/g, '').replace(/\u00BB/g, "").replace(/\uFFE2/g, "").replace(/\u0021/g, "").replace(/\u003F/g, "").replace(/\uFF1B/g, "").replace(/\u003B/g, "").toLowerCase()) !== -1;
      });
      if (this.state.searchbartext.length > 1){
        this.setState({filteredplantdata: list});
      } else {
        this.setState({filteredplantdata: false});
      }
    } else if (!searchbar && this.props.allplantdata){
      let arrayofsuggested = [];
      let randomsuggested = [];
      list.map((x, i) => {
        if(x.zone !== null && x.zone.toLowerCase().includes(this.state.zipzone.slice(0, -1)) && (x.seasonal_interest.toLowerCase().includes(this.state.date.season.toLowerCase()) || x.seasonal_interest.toLowerCase().includes(this.state.date.season.toLowerCase().replace(/-/g, ' ')))){
          arrayofsuggested.push(x)
        }
      });
      for (let i = 0; i < 6; i++){
        let newSuggestion = arrayofsuggested.splice(Math.floor(Math.random()*arrayofsuggested.length), 1);
        randomsuggested.push(newSuggestion[0]);
      }
      this.setState({suggested:randomsuggested});
    }
  }
  handleTextChange = (event) => {
    event.preventDefault();
    let value = event.target.value;
    let targetid = event.target.id;
    if (this.state[targetid] !== undefined && !(targetid === "zipcode" && value.length > 5)){
      this.setState({[targetid]: value , fireRedirect: false}, ()=>{
        if (this.props.allplantdata && targetid === "searchbartext"){
          this.filterlist(true, value);
        }
      });
    }
    if (event.target.id === "zipcode" && !(targetid === "zipcode" && value.length > 5)){
      this.updateZip(value);
    }
  }
  handleSelectChange = (event) => {
    event.preventDefault();
    console.log(event.target);
    this.setState(({ divisionsChecked }) => (
      {divisionsChecked: !divisionsChecked}
    ), ()=>{
      console.log(this.state.divisionsChecked);
    });
  }
  render() {
    let searchResults = false;
    let suggestedResults = false;
    if (this.state.filteredplantdata){
      if (this.state.filteredplantdata.length > 50){
        searchResults =
          <div>
            <h3 className="text-center">
              There are currently {this.state.filteredplantdata.length} results... Please refine your search!
            </h3>
          </div>
      } else if (this.state.filteredplantdata.length <= 50 && !this.state.expandResults) {
        searchResults =
        <div className="container text-center">
          <p className="pagination-centered text-center">
            {this.state.filteredplantdata.length} Results
          </p>
          {this.state.filteredplantdata.map((x, i) =>{
            let inlinelink = `/plants/${x.plant_id}`
            return (
              <div className="rounded" key={x.plant_id}>
                <h4>
                  <Link to={inlinelink}>
                    {x.common_name.replace(/\s\s+/g, ' ').replace(/\u00AC/g, '').replace(/\u00BB/g, "").replace(/\uFFE2/g, "").replace(/\u0021/g, "").replace(/\u003F/g, "").replace(/\uFF1B/g, "").replace(/\u003B/g, "")}
                  </Link>
                </h4>
              </div>
            )
          })}
        </div>
      }
    }
    if (this.props.allplantdata && this.state.suggested){
      suggestedResults =
        <div className="container text-center">
          <h3 className="pagination-centered text-center">
            Suggestions
          </h3>
          {this.state.suggested.map((x, i) =>{
            let inlinelink = `/plants/${x.plant_id}`
            return (
              <div className="rounded" key={x.plant_id}>
                <h4>
                  <Link to={inlinelink}>
                    {x.common_name.replace(/\s\s+/g, ' ').replace(/\u00AC/g, '').replace(/\u00BB/g, "").replace(/\uFFE2/g, "").replace(/\u0021/g, "").replace(/\u003F/g, "").replace(/\uFF1B/g, "").replace(/\u003B/g, "")}
                  </Link>
                </h4>
              </div>
            )
          })}
          <button type="button"
            onClick={event => this.filterlist(false)}
            className="btn btn-success btn-sm">
            Show more suggestions
          </button>
        </div>
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
          <div className="pagination-centered text-center">
            <div className="homepage-settings-section">
              <div>
                zip code
                <input type="search" id="zipcode"
                  value={this.state.zipcode}
                  onChange={this.handleTextChange}
                  className="homepage-search-box"/>
              </div>
              <div>
                Seasonal Divisions:
                <input onChange={this.handleSelectChange}
                  id="divisions-checkBox"
                  type="checkbox"
                  checked={this.state.divisionsChecked}
                  value={this.state.divisionsChecked}/>
                <select className="custom-select">
                  <option selected>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
            </div>
            <span>
            {this.state.zone ? this.state.zone : ""}
            </span>
          </div>
          {searchResults ? searchResults : ""}
          {suggestedResults ? suggestedResults : ""}
        </form>
      </div>
    );
  }
}
