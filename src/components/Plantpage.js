import React, { Component } from 'react';
import request from 'superagent';
import Chart from 'chart.js';
import '../styles/App.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import {redirectAction} from '../actions/actions.js';
import { Button } from 'react-bootstrap';
let Alert = require('react-bootstrap').Alert;


class Plantpage extends Component {
  constructor(props) {
      super(props)
      this.state = {
        fireredirect: false,
        message: false,
        plant_id: 1,
        common_name: null,
        main_image: null,
        wikipedia_image: null,
        wikipedia_image_final: null,
        wikipedia_responseText: null,
        plantdata: false,
        image_message: null,
        wiki_link: null,
        user_plot_data: [],
        popupVisible: false,
        commentsVisible: false,
        added_to_plot: "",
        alertVisible: false,
        sunMessage: "",
        waterMessage: 'More specific water information coming soon.',
        soilMessage: 'More specific soil information coming soon.',
        maturationMessage: 'Time to maturity data coming soon.',

      };
      this.addPlantToPlot = this.addPlantToPlot.bind(this);
  }

  componentDidMount(){
    console.log(this.props.token);
    // console.log(this.props.zipcode);
    // console.log(this.state.zipcode);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }

  // Opens the plant dropdown menu.
  openPlotDropdown(event){
    event.preventDefault();
    // console.log("dropdown clicked");
    document.getElementById("myDropdown").classList.toggle("show");

    if (!this.state.popupVisible) {
      // attach/remove event handler
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }
    this.setState(prevState => ({
      // popupVisible: true,
      popupVisible: !prevState.popupVisible,
        }));
        // console.log(this.state.popupVisible);
  }

  // Opens the comments
  openPlotDropdownComment(event){
    event.preventDefault();
    console.log("dropdown comment clicked");
    document.getElementById("myDropdownComments").classList.toggle("show");

    // if (!this.state.popupVisible) {
    //   document.addEventListener('click', this.handleOutsideClick, false);
    // } else {
    //   document.removeEventListener('click', this.handleOutsideClick, false);
    // }
    this.setState(prevState => ({
      // popupVisible: true,
      commentsVisible: !prevState.commentsVisible,
        }));
        // console.log(this.state.popupVisible);
  }

  // Close the dropdown menu
  closePlotDropdown(event){
    if(event !== undefined){
      event.preventDefault();
    }
    // console.log("dropdown should close");
    let dropdowns = document.getElementsByClassName("dropdown-content");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
    this.setState(prevState => ({
           popupVisible: !prevState.popupVisible,
        }));
        // console.log(this.state.popupVisible);
  }

  // Close the dropdown menu if the user clicks outside of it
  handleOutsideClick = (e) => {
    // console.log('handleOutsideClick');
    document.removeEventListener('click', this.handleOutsideClick, false);
    if(this.state.popupVisible === true){
      this.closePlotDropdown();
    } else {
      return;
    }
  }

  // This gets and md5 hash for a given string.
  // Source: https://css-tricks.com/snippets/javascript/javascript-md5/

  plantInfoGet(event) {
    //  This lets the user 'bypass' CORs via proxy.
     const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
     if( event !== undefined){
       event.preventDefault();
     }
     let search_term = 'Potentilla';
     let plant_species_image = false;
     let returned_value = false;
    //  Keep this while testing.
     returned_value = true;
     request
      .get(`${proxyurl}https://canigrow.herokuapp.com/api/plants/${this.state.plant_id}`)
      .end((err, res)=>{
        if (res !== undefined){
          console.log(res.body);
          if (res.body !== undefined && res.body !== null){
            if (res.body.plant !== undefined && res.body.plant !== null){
              // console.log(res.body.plant.common_name);
              // console.log(res.body.plant.scientific_name);
              search_term = res.body.plant.scientific_name;
              this.setState({common_name: res.body.plant.common_name});
              this.setState({plantdata: res.body.plant});
              returned_value = true;
            }
          }

          // This obtains an image from wikipedia
          if(returned_value){
            // console.log("Search Term: " + search_term);

            // let only_first_search_term = search_term.substr(0,search_term.indexOf(' '));
            // console.log(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages%7Cpageterms&generator=prefixsearch&redirects=1&formatversion=2&piprop=thumbnail&pithumbsize=250&pilimit=20&wbptterms=description&gpssearch=`+`${search_term}`+`&gpslimit=20`);
             request
             .get(`${proxyurl}https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages%7Cpageterms&generator=prefixsearch&redirects=1&formatversion=2&piprop=thumbnail&pithumbsize=250&pilimit=20&wbptterms=description&gpssearch=`+search_term+'&gpslimit=20')
              .end((err, res)=>{
                if(res !== null && res !== undefined){
                  if(res.xhr !== null && res.xhr !== undefined){
                    if(res.xhr.responseText !== null && res.xhr.responseText !== undefined){
                      // console.log(res);
                      console.log(res.xhr.responseText);
                      // console.log(res.xhr.responseText);
                      let string = res.xhr.responseText
                      let obj = JSON.parse(string);
                      if(obj.query !== undefined){
                        console.log(obj);
                        // CHecks to see if the image is of a 'species of plant'
                        if(obj.query.pages[0] !== undefined){
                          if(obj.query.pages[0].terms !== undefined){
                            if(obj.query.pages[0].terms.description[0] !== undefined){
                              if(obj.query.pages[0].terms.description[0] === 'species of plant'){
                                console.log(obj.query.pages[0].terms.description[0]);
                                // The following line simply prevents an error.
                                plant_species_image = res;
                                // This indicates that the image is of a 'species of plant'.
                                plant_species_image = true;
                              }
                            }
                          }
                        }
                        // let imageNum = Object.keys(obj.query.pages)[0];
                        // console.log(obj.query.pages);
                        // console.log(obj.query.pages[0]);
                        if( obj.query.pages[0].thumbnail === undefined){
                          // console.log('No Image to Show');
                          this.setState({image_message : "There is no image available for this plant in our database at this time."});
                          this.setState({wikipedia_image_final: 'https://i.imgur.com/J7vF1F0.jpg'});
                        } else if(plant_species_image){
                            this.setState({image_message : "null"});
                            console.log(obj.query.pages[0].thumbnail.source);
                            this.setState({wikipedia_image_final: obj.query.pages[0].thumbnail.source});
                        } else {
                          // console.log('No Plant Image to Show');
                          this.setState({image_message : "There is no image available for this plant in our database at this time."});
                          this.setState({wikipedia_image_final: 'https://i.imgur.com/J7vF1F0.jpg'});
                        }
                        console.log(search_term);
                          // If the search was for Hosta.
                          if(search_term === 'Hosta'){
                            this.setState({wikipedia_image_final: 'https://www.whiteflowerfarm.com/mas_assets/cache/image/3/6/6/f/13935.Jpg'});

                          }
                          // If the search was for Brassica oleracea.
                          if(search_term === 'Brassica oleracea'){
                            this.setState({wikipedia_image_final: 'https://www.bountifulgardens.org/attachments/fb473a3a66176a39e3e392e44a7d3c2a1cf5ebab/store/44d6099825987fd4acbb213e3651f06ead83360684ae9bea2dca5b10f133/VBR-2560-Broccoli-purple-sprouting-web.jpg'});

                          }
                      } else {
                        // This is a  different request that returns different json. It is an alternative way to obtain an image using only one search term.
                        console.log("Try to get images another way");
                        // console.log(res);
                        let only_first_search_term = search_term.substr(0,search_term.indexOf(' '));
                        console.log(only_first_search_term);
                        request
                        .get(`${proxyurl}https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages%7Cpageterms&generator=prefixsearch&redirects=1&formatversion=2&piprop=thumbnail&pithumbsize=250&pilimit=20&wbptterms=description&gpssearch=`+only_first_search_term)
                         .end((err, res)=>{
                            //  console.log(res);
                             console.log(res.xhr.responseText);
                            let string = res.xhr.responseText
                            let obj = JSON.parse(string);
                            //  console.log(obj);
                             console.log(obj.query.pages[0]);
                            // let imageNum = Object.keys(obj.query.pages)[0];
                            // console.log(obj.query.pages[0].thumbnail.source);

                            // If the search was for Hosta Hosta ventricosa.
                            if(search_term === 'Hosta ventricosa' || search_term === 'Hosta plantaginea'){
                              this.setState({wikipedia_image_final: 'https://www.whiteflowerfarm.com/mas_assets/cache/image/3/6/6/f/13935.Jpg'});
                            } else {
                              if(obj.query.pages[0].thumbnail !== undefined){
                                this.setState({wikipedia_image_final: obj.query.pages[0].thumbnail.source});
                              } else {
                                this.setState({wikipedia_image_final: 'https://i.imgur.com/J7vF1F0.jpg'});
                              }
                            }
                            this.setState({image_message : "null"});
                         })
                      }
                    }
                  }
                }
              })
          }
        }
      })
  }

  // This generates a wikipedia link.
  createWikiLink(scientific_name) {
    // console.log(scientific_name);
    let add_on = scientific_name.replace(" ","_");
    let link = "https://en.wikipedia.org/wiki/" + add_on;
    console.log("Wiki: "+link);
    this.setState({wiki_link: link});
  }

  // This generates the sun chart data.
  createSunChart(){
    // This handles soil information.
    let soilMessage = 'This plant likes soil with approx. 6.5 pH.';

    // This generates a number of hours that the plant needs sunlight.
    let light_string = this.state.plantdata.light;
    let soil_string = this.state.plantdata.soil;
    let sunMessage = null;
    let sun_max_value = 2;
    let sun_min_value = 0;
    let soil_pH_max = 6;
    let soil_pH_min = 5;
    // Handles minimum sunlight.
    if(this.state.plantdata !== null && this.state.plantdata !== undefined){
      if(this.state.plantdata.light !== null && this.state.plantdata.light !== undefined){
        // console.log(this.state.plantdata.light);
        if(light_string.includes('Full sun')){
          sun_min_value = 6;
        }
        if(light_string.includes("Part sun")){
          sun_min_value = 4;
        }
        if(light_string.includes("Part shade")){
          sun_min_value = 2;
        }
        if(light_string.includes("Full shade")){
          sun_min_value = 0;
        }
        // Handles maximum sunlinght.
        if(light_string.includes('Full shade')){
          sun_max_value = 3;
          sunMessage = 'This plant grows well in the shade.';
        }
        if(light_string.includes("Part shade")){
          sun_max_value = 4;
          sunMessage = 'This plant grows well in the shade.';
        }
        if(light_string.includes("Part sun")){
          sun_max_value = 6;
          sunMessage = 'This plant grows well with partial sunlight.';
        }
        if(light_string.includes("Full sun")){
          console.log("full");
          sun_max_value = 10;
          sunMessage = 'This plant grows well with direct sunlight.';
        }
        if(sun_min_value <= 2 && sun_max_value >= 10){
          sunMessage = 'This plant grows well with lots or little sunlight.';
        }
        if(sun_min_value >= 6 && sun_max_value >= 10){
          sunMessage = 'This plant requires lots of sunlight.';
        }
        if(sun_min_value <= 2 && sun_max_value <= 4){
          sunMessage = 'This plant should be grown in a shady area.';
        }
        this.setState({sunMessage: sunMessage});

        // This handles soil information.
        if(this.state.plantdata.soil !== null && this.state.plantdata.soil !== undefined){
          if(this.state.plantdata.soil !== " "){
            soilMessage = "";
          }
          console.log(this.state.plantdata.soil);
          if(soil_string.includes("Adaptable")){
            soilMessage = 'This plant can adapt to most types of soil.';
          }
          if(soil_string.includes("Prefers evenly-moist")){
            soilMessage = soilMessage + ' Prefers evenly-moist soil.';
          }
          if(soil_string.includes("Prefers dry")){
            soilMessage = soilMessage + ' This plant prefers dry soil.';
          }
          if(soil_string.includes("Prefers high organic matter")){
            soilMessage = soilMessage + ' Prefers high organic matter.';
          }
          if(soil_string.includes("Prefers well-drained")){
            soilMessage = soilMessage + ' Prefers well-drained.';
          }
          if(soil_string.includes("Prefers loam")){
            soilMessage = soilMessage + ' Prefers loamy soil.';
          }
          if(soil_string.includes("Tolerates dry")){
            soilMessage = soilMessage + ' Tolerates dry soil.';
          }
          if(soil_string.includes("Tolerates poor")){
            soilMessage = soilMessage + ' Tolerates poor quality soil.';
          }
        }
        this.setState({soilMessage: soilMessage});
      }
    }

    let max_water_value = sun_max_value - sun_min_value + 1;

    if(document.getElementById("mySunChart") !== null){
      let ctx = document.getElementById("mySunChart").getContext('2d');
      // Chart.defaults.global.defaultFontColor = 'black';
      // Chart.defaults.global.defaultFontSize = '12';
      // let mySunChart  =
      new Chart(ctx, {
      type: 'horizontalBar',
      data: {
          labels: ["Sunlight (hours/day)", "Water (in/month)", "Soil pH", "Time to Maturity (weeks)"],
          datasets: [
            {
              label: 'Minimum Required',
              data: [sun_min_value, 2, soil_pH_max, 5],
              backgroundColor: [
                  '#e5e5e5',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
              ],
              borderColor: [
                  '#ffff00',
                  'rgba(54, 162, 235, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(75, 192, 192, 1)',
              ],
              borderWidth: 1
          },
          {
            label: 'Maximum Tolerated',
            data: [sun_max_value-sun_min_value, max_water_value, soil_pH_max-soil_pH_min, 0],
            backgroundColor: [
                'rgba(255, 206, 86, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                // 'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
                '#ffff00',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
                // 'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1
        }
        ]
      },
      options: {
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
        }
      }
      });
    }
  }

  addPlantToPlot(event, plot){
    event.preventDefault();
    //  This lets the user 'bypass' CORs via proxy.
    const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
    // For the plot number
    // console.log(plot);
    if(this.props !== null ||this.props !== undefined){
      if(this.props.username !== null || this.props.username !== undefined){
        if(this.props.token !== null || this.props.token !== undefined){
          // For the plant id
          // console.log(this.state.plantdata.plant_id);
          request
          .post(`${proxyurl}https://canigrow.herokuapp.com/api/plants/${this.state.plantdata.plant_id}/favorite`)
          .set('Authorization', 'Token token='+this.props.token)
          .send({
                    id: plot
               })
          .end((err, res) => {
            let message = "";
              if (err) {
                // console.log(err);
                // console.log("failed to add to plot!");
                message = `Failed to add to plot. Please try again later`;
              } else {
                // console.log(res.body);
                // console.log(res.body.error);
                message = `Successfully added to plot!`;
                if(res.body.error !== undefined){
                  message = res.body.error;
                }
              }
              this.setState({added_to_plot: message,
              alertVisible:true });
          })
        }
      }
    }
  }

  getPlots(){
    //  This lets the user 'bypass' CORs via proxy.
    const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
    if(this.props !== null ||this.props !== undefined){
      if(this.props.username !== null || this.props.username !== undefined){
        if(this.props.token !== null || this.props.token !== undefined){
          request
          .get(`${proxyurl}https://canigrow.herokuapp.com/api/users/${this.props.username}`)
          .end((err, res) => {
              if (err) {
                console.log("failed to get plots!");
              } else {
                // console.log(res.body);
                // console.log(res.body.user.plots);
                // let user_plot_data = res.body.user.plots;
                this.setState({user_plot_data: res.body.user.plots}, () => {
                  // console.log('afterSetStateFinished')
                  // console.log(this.state.user_plot_data)
                });
              }
          })
        }
      }
    }
  }


  componentWillMount() {
    if (this.props.redirection && this.props.redirection[0] !== undefined){
      this.setState({message:this.props.redirection[1]}, ()=>{
        this.props.redirectAction([false, false]);
      });
    }
    console.log(this.props);
    this.getPlots();
    const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
    this.setState({plant_id:window.location.href.split("/plants/")[1]}, ()=>{
      request
       .get(`${proxyurl}https://canigrow.herokuapp.com/api/plants/${this.state.plant_id}`)
       .end((err, res)=>{
         if (res !== undefined && res !== null){
           if (res.body !== undefined && res.body !== null){
             if (res.body.plant !== undefined && res.body.plant !== null){
              //  console.log(res.body.plant.common_name);
               this.plantInfoGet();
               this.setState({plantdata: res.body.plant});
               console.log('Plant Data');
               console.log(res.body.plant);
               this.createWikiLink(res.body.plant.scientific_name);
               this.createSunChart();
             }
           }
         }
       })
    });
  }
  componentDidUpdate(){
    if (this.props.redirection[0] !== undefined && this.props.redirection[0]){
      this.setState({fireredirect:true});
    }
  }

  // This makes alerts go away.
  handleAlertDismiss = () => {
    this.setState({alertVisible: false});
  }

  // This takes the user to see another's user's page.
  goToUser = (event, user, user_href) => {
    console.log("Go to see: " + user + " at " + user_href);
  }

  render() {
    // console.log(this.state.image_message);
    // console.log(this.state.user_plot_data);
    // This makes the additional notes only appear if the plant actually has additional notes.
    let plantdata_notes = true;
    if(this.state.plantdata.notes === ' ' || this.state.plantdata.notes === null || this.state.plantdata.notes === undefined){
      plantdata_notes = false;
    }

    // This replaces all the ';' with ',' in the this.state.plantdata.seasonal_interest and form.
    let plantdata_seasonal_interest_comma = null;
    let plantdata_form_comma = null;
    if(this.state.plantdata){
      let plantdata_seasonal_interest = this.state.plantdata.seasonal_interest;
      plantdata_seasonal_interest_comma = plantdata_seasonal_interest.replace(new RegExp(';', 'g'), ",");
      let plantdata_form = this.state.plantdata.form;
      plantdata_form_comma = plantdata_form.replace(new RegExp(';', 'g'), ",");
    }

    // This changes the contents of the propsDropDown.
    // console.log(this.props.token);
    let propsDropDown = null;
    // If the user is logged in.
    if(this.props.token !== null){
      // If the user has plots.
      if(this.state.user_plot_data !== null && this.state.user_plot_data[0] !== undefined){
        propsDropDown =
        <div className="centerHomeButton">
          <div>
            <div className="dropdown">
              <button onClick={event => this.openPlotDropdown(event)} className="dropbtn" data-toggle="button" aria-pressed="false">Save to your garden</button>
              <div id="myDropdown" className="dropdown-content style-margin-bottom-20px">
                {this.props.token ? (
                    <div>
                      {this.state.user_plot_data.map( (plot,i) => {
                           return(
                             <div key={i} className="blue-hover" onClick={event => this.addPlantToPlot(event, plot.plot_id)}>
                               <p className="font-size-16px">Add to {plot.plot_name}</p>
                             </div>
                           )
                       })}
                  </div>
                ): "Add A Plot"}
              </div>
            </div>
            {/* <button onClick={event => this.closePlotDropdown(event)} className="dropbtn">Close Dropdown</button> */}
          </div>
        </div>
        // If the user does not have any plots.
      } else {
        propsDropDown =
        <div className="centerHomeButton">
          <NavLink activeClassName="selected" to={`/canigrow-frontend/user/${ this.props.username }`}>
            <input className='btn btn-primary btn-lg' type='submit' value='Create A Plot'/>
          </NavLink>
        </div>
      }
      // If the user is not logged in.
    } else {
      propsDropDown =
      <div className="centerHomeButton">
          <NavLink activeClassName="selected" to="/canigrow-frontend/login">
            <input className='btn btn-primary btn-lg' type='submit' value='Login to save plants to your garden'/>
          </NavLink>
      </div>
    }

    // This handles comments about the plant.
    let plantComments = null;
    let viewComments = "No Comments Yet";
    if(this.state.plantdata.comments){
      console.log(this.state.plantdata.comments);
      let testForComments = JSON.stringify(this.state.plantdata.comments);
      if(testForComments !== '[]'){
        viewComments = "View Comments";
        plantComments =
        <div className="centerHomeButtonComments">
          <div>
            {/* <div className="dropdown"> */}
              {/* <button onClick={event => this.openPlotDropdown(event)} className="dropbtn" data-toggle="button" aria-pressed="false">Save to your garden</button> */}
              {/* <div id="myDropdown" className="dropdown-content style-margin-bottom-20px"> */}
                <div>
                  {this.state.plantdata.comments ? (
                      <div>
                        {this.state.plantdata.comments.map( (comment,i) => {
                             return(
                               <div key={i} className="blue-hover" onClick={event => this.goToUser(event, comment.user, comment.user_href)}>
                                 <p className="font-size-16px">{comment.user} - {comment.body}</p>
                               </div>
                             )
                         })}
                    </div>
                  ): "No Comments Yet"}
                </div>
              {/* </div> */}
            {/* </div> */}
            {/* <button onClick={event => this.closePlotDropdown(event)} className="dropbtn">Close Dropdown</button> */}
          </div>
        </div>
      } else {
        // console.log('else');
        plantComments =
          <div>
            <p>No Comments Yet</p>
          </div>
      }
    } else {
      // console.log('else');
      plantComments =
        <div>
          <p>No Comments Yet</p>
        </div>
    }

    // This handles the comment form button.
    let commentFormButton = null;
    if(this.state.plantdata){
      commentFormButton =
        <div className='margin-left-200'>
            <NavLink activeClassName="selected" to="/canigrow-frontend/login">
              <input className='btn btn-link font-size-25px margin-top-20pt' type='submit' value='Login to Comment'/>
            </NavLink>
        </div>
    }
    // This generates the calendar link.
    let calendarButton = null;
    if(this.state.plantdata.spring_start_relative_last_frost){
      calendarButton =
      <div className='m'>
          <NavLink activeClassName="selected" to={`/canigrow-frontend/calendar/${ this.state.plantdata.plant_id }`}>
            <input className='btn btn-link font-size-25px margin-top-20pt' type='submit' value='View a Growing Schedule'/>
          </NavLink>
      </div>
    }





    return (
      <div className="plantpage-container main-component-container">
        {this.state.alertVisible ? (<div>
          <Alert className="alert alert-success" onDismiss={this.handleAlertDismiss}>
                    <h4>{this.state.added_to_plot}</h4>
                    <p>
                      <Button onClick={this.handleAlertDismiss}>Hide Alert</Button>
                    </p>
                  </Alert>
        </div>): ""}
        <div className="plantpage-sub-container">
          <div className="top_items_plant_page">
            <div className="all_plant_page_images">
              <img className="plant_big_image" src={this.state.wikipedia_image_final} alt="Loading Image..." width="570px" height="724px"/>
              <div className="plant_page_graph">
                {this.state.plantdata ? (
                <div>
                  <div className="outer_chart_for_plant">
                    <p className="font-size-16px">{this.state.plantdata.common_name}'s Growth Needs</p>
                  </div>
                  <div className="outer_chart_for_plant">
                    <div className="chart_for_plant">
                      <canvas id="mySunChart" width="400" height="400"></canvas>
                    </div>
                  </div>
                </div> ): ""}
              </div>
            </div>

            <div className="all_plant_page_right_items">
              <div className="top_items_plant_page_right">
                <div className="top_items_plant_page_right_tile">{this.state.plantdata ? (
                  <h2>{this.state.plantdata.common_name}</h2>
                  ): ""}
                </div>
                <hr/>
                <div className="top_items_plant_page_right_plant_info">
                  {this.state.plantdata ? (
                    <div>
                      {propsDropDown}
                      <p className="plant_info_scientific_name font-size-16px margin-top-20pt">{this.state.plantdata.scientific_name}</p>
                      <p className="font-size-16px">Dimensions: {this.state.plantdata.height} height x {this.state.plantdata.spread} width</p>
                      <p className="font-size-16px">General shape: {plantdata_form_comma}</p>
                      <p className="font-size-16px">Optimum growing season(s): {plantdata_seasonal_interest_comma}</p>

                      {plantdata_notes ? (
                        <p className="font-size-16px">Additional Notes: {this.state.plantdata.notes}</p>
                      ): ""}
                      {this.state.plantdata.seasonal_interest_specific ? (
                        <p className="font-size-16px">Specific Notes: {this.state.plantdata.seasonal_interest_specific}</p>
                      ): ""}
                      <a href={this.state.wiki_link} className="font-size-16px">Learn More</a>
                    </div>
                     ): ""}
                </div>
              </div>

              <div className="plant_page_graph_messages margin-left-20pt margin-top-20pt">
                <p className="font-size-16px margin-left-10pt">Based on your location:</p>
                {this.state.plantdata ? (
                  <div>
                    <p className="font-size-16px margin-left-10pt">{this.state.sunMessage}</p>
                    <p className="font-size-16px margin-left-10pt ">{this.state.waterMessage}</p>
                    <p className="font-size-16px margin-left-10pt">{this.state.soilMessage}</p>
                    <p className="font-size-16px margin-left-10pt">{this.state.maturationMessage}</p>

                    <div className="plant_page_buttons">
                      <div className="plant_page_comments margin-left-20pt">
                        <div>
                          {calendarButton}
                        </div>

                        {/* These hold old versions of the comment buttons. */}
                        {/* <div className="dropdown">
                          <button onClick={event => this.openPlotDropdownComment(event)} className="dropbtn" data-toggle="button" aria-pressed="false">{viewComments}</button>
                          <div id="myDropdownComments" className="dropdown-content style-margin-bottom-20px">
                            <div className="plant_comments">{plantComments}</div>
                          </div>
                        </div> */}

                      </div>



                      {/* <div>
                        {commentFormButton}
                      </div> */}

                    </div>


                    <p className="bottom-text margin-left-20pt">**Location data may vary. Consult your local plant nursery for more information.</p>
                  </div>
                   ): ""}
              </div>

            </div>




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
    return {
      redirection: state.redirection,
      token: state.token,
      zipcode: state.zipcode,
      username: state.username,
    };
}

function matchDispatchToProps(dispatch){
    // binds the action creation of prop to action. selectUser is a function imported above. Dispatch calls the function.
    return bindActionCreators({redirectAction: redirectAction}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Plantpage);
