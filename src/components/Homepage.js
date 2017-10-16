import React, { Component } from 'react';
import '../styles/App.css';
import request from 'superagent';
import zipcodearray from './../zipcodes.json';
import { Link, Redirect } from 'react-router-dom';
import {setZip} from '../actions/zipcodeAction.js';
import {redirectAction} from '../actions/actions.js';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class Homepage extends Component {
  constructor(props){
    super(props);
    this.state = {
      fireredirect: false,
      message: false,
      searchbartext: "",
      zipcode: "",
      filteredplantdata: false,
      expandResults: false,
      zone: false,
      zipzone: false,
      suggested: false,
      date: false,
      divisionsChecked: true,
    }
    this.filterlist = this.filterlist.bind(this);
  }
  componentWillMount(){
    if (this.props.redirection && this.props.redirection[0] !== undefined){
      this.setState({message:this.props.redirection[1]}, ()=>{
        this.props.redirectAction([false, false]);
      });
    }
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
            searchSeason: season,
          }
          this.setState({zipcode: res.body.zip_code, date:fulldatedata}, ()=>{
            this.updateZip(this.state.zipcode);
            setZip(this.state.zipcode);
          });
        }
      })
  }
  componentDidUpdate(prevProps, prevState){
    if (this.props.redirection[0] !== undefined && this.props.redirection[0]){
      this.setState({fireredirect:true});
    }
    if (this.props.allplantdata !== prevProps.allplantdata){
      this.filterlist(false);
    }
  }
  updateZip = (zip) => {
    setZip(zip);
    let zipzone = false
    zipcodearray.map((x, i) =>{
      if (x.zipcode === zip){
        return zipzone = x.zone
      }
      return null
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
  filterlist(searchbar, searchterm, preventOverflow){
    let list = this.props.allplantdata;
    if (searchbar && this.props.allplantdata){
      list = list.filter(function(item){
        return item.common_name.replace(/\s\s+/g, ' ').replace(/\u00AC|\u00BB|\uFFE2|\u0021|\u003F|\uFF1B|\u003B/g, '').toLowerCase().search(
          searchterm.replace(/\s\s+/g, ' ').replace(/\u00AC|\u00BB|\uFFE2|\u0021|\u003F|\uFF1B|\u003B/g, '').toLowerCase()) !== -1;
      });
      if (this.state.searchbartext.length > 0 && list.length > 0){
        this.setState({filteredplantdata: list});
      } else if (this.state.searchbartext.length > 1 && list.length === 0 && preventOverflow === undefined && searchterm.includes(" ")){
        let newterm = searchterm.replace(/\s+/g, '');
        return this.filterlist(true, newterm, true);
      } else if (this.state.searchbartext.length > 0 && list.length === 0){
        this.setState({filteredplantdata: list});
      } else {
        this.setState({filteredplantdata: false});
      }
    } else if (!searchbar && this.props.allplantdata){
      let arrayofsuggested = [];
      let randomsuggested = [];
      list.map((x, i) => {
        if(x.zone !== null && x.zone.toLowerCase().includes(this.state.zipzone.slice(0, -1)) && (x.seasonal_interest.replace(/\u00AC|\u00BB|\uFFE2|\u0021|\u003F|\uFF1B|\u003B/g, '').toLowerCase().includes(this.state.date.searchSeason.toLowerCase()) || x.seasonal_interest.toLowerCase().replace(/\u00AC|\u00BB|\uFFE2|\u0021|\u003F|\uFF1B|\u003B/g, '').includes(this.state.date.searchSeason.toLowerCase().replace(/-/g, ' ')))){
          arrayofsuggested.push(x)
        }
        return null
      });
      if (arrayofsuggested.length < 6){
        if(this.state.date.searchSeason.includes('-')){
          this.setState({date : {...this.state.date, searchSeason: this.state.date.searchSeason.split("-")[1]}},()=>{
            this.filterlist(false);
          })
        } else {
          randomsuggested.push(false);
          this.setState({suggested:randomsuggested});
        }
      } else {
        for (let i = 0; i < 6; i++){
          let newSuggestion = arrayofsuggested.splice(Math.floor(Math.random()*arrayofsuggested.length), 1);
          randomsuggested.push(newSuggestion[0]);
        }
        this.setState({suggested:randomsuggested});
      }
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
    if (event.target.id === "divisions-checkBox" && this.state.date){
      let seasonSearchChange = "";
      if (this.state.date.searchSeason.includes('-')){
        seasonSearchChange = this.state.date.generalseason;
      } else {
        seasonSearchChange = this.state.date.season;
      }
      this.setState(({ divisionsChecked, date }) => (
        {divisionsChecked: !divisionsChecked, date : {...this.state.date, searchSeason: seasonSearchChange}}
      ), ()=>{
        this.filterlist(false);
      });
    } else if (event.target.id === "divisons-select-options" && this.state.date){
      let newValue = event.target.value;
      this.setState(({ date }) => (
        {date : {...this.state.date, searchSeason: newValue}}
      ), ()=>{
        this.filterlist(false);
      });
    }
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
                    {x.common_name.replace(/\s\s+/g, ' ').replace(/\u00AC|\u00BB|\uFFE2|\u0021|\u003F|\uFF1B|\u003B/g, '')}
                  </Link>
                </h4>
              </div>
            )
          })}
        </div>
      }
    }
    if (this.props.allplantdata && this.state.suggested && this.state.suggested[1] !== undefined){
      suggestedResults =
        <div className="container text-center">
          <h3 className="pagination-centered text-center">
            Suggestions
          </h3>
          <p>
            Suggestions based on {this.state.zipcode} and {this.state.date.searchSeason}
          </p>
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
    } else if (this.props.allplantdata && this.state.suggested && this.state.suggested[0] === false){
      suggestedResults =
        <div className="container text-center">
          <h3 className="pagination-centered text-center">
            Suggestions
          </h3>
          <p>
            Suggestions based on {this.state.zipcode} and {this.state.date.searchSeason}
          </p>
          <p>
            There are no results. Sorry!
          </p>
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
        <div>
          <div className="plantpage-sub-container">
            <form>
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
                  {this.state.date ? (
                    <div>
                      <input onChange={this.handleSelectChange}
                        id="divisions-checkBox" type="checkbox"
                        className="styled-checkbox"
                        checked={this.state.divisionsChecked}
                        value={this.state.divisionsChecked}/>
                      <label htmlFor="divisions-checkBox">Seasonal Divisions:</label>
                      {this.state.divisionsChecked ? (
                        <select className="custom-select homepage-season-selection" id="divisons-select-options"
                          value={this.state.date.searchSeason}
                          onChange={this.handleSelectChange}>
                          <option value="Early-Winter">Early-Winter</option>
                          <option value="Mid-Winter">Mid-Winter</option>
                          <option value="Late-Winter">Late-Winter</option>
                          <option value="Early-Spring">Early-Spring</option>
                          <option value="Mid-Spring">Mid-Spring</option>
                          <option value="Late-Spring">Late-Spring</option>
                          <option value="Early-Summer">Early-Summer</option>
                          <option value="Mid-Summer">Mid-Summer</option>
                          <option value="Late-Summer">Late-Summer</option>
                          <option value="Early-Fall">Early-Fall</option>
                          <option value="Mid-Fall">Mid-Fall</option>
                          <option value="Late-Fall">Late-Fall</option>
                        </select>
                      ):(
                        <select className="custom-select homepage-season-selection" id="divisons-select-options"
                          value={this.state.date.searchSeason}
                          onChange={this.handleSelectChange}>
                          <option value="Winter">Winter</option>
                          <option value="Spring">Spring</option>
                          <option value="Summer">Summer</option>
                          <option value="Fall">Fall</option>
                        </select>
                      )}
                    </div>
                  ):""}
                </div>
                <span>
                {this.state.zone ? this.state.zone : ""}
                </span>
                <br/>
              </div>
              {searchResults ? searchResults : ""}
              <br/>
              {suggestedResults ? suggestedResults : ""}
            </form>
        </div>
      </div>
        {this.state.fireredirect && (
            <Redirect to={this.props.redirection[0]}/>
          )}
      </div>
    );
  }
}

function mapStateToProps(state) {
    console.log(state);
    return {
      token: state.token,
      username: state.username,
      redirection: state.redirection,
      zipcode: state.zipcode,
    };
}

function matchDispatchToProps(dispatch){
    // binds the action creation of prop to action. selectUser is a function imported above. Dispatch calls the function.
    return bindActionCreators({setZip: setZip, redirectAction: redirectAction}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Homepage);
