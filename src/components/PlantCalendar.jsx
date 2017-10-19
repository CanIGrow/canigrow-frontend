import React, { Component } from 'react';
import request from 'superagent';
import Chart from 'chart.js';
import '../styles/App.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import {redirectAction} from '../actions/actions.js';
import { Button } from 'react-bootstrap';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
let Alert = require('react-bootstrap').Alert;



// This makes the calendar.
// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
// BigCalendar.setLocalizer(
//   BigCalendar.momentLocalizer(moment)
// );
//
// let myEventsList = null;
//
// const MyCalendar = props => (
//   <div>
//     <BigCalendar
//       events={myEventsList}
//       startAccessor='startDate'
//       endAccessor='endDate'
//     />
//   </div>
// );

BigCalendar.momentLocalizer(moment);
let formats = {
  dateFormat: 'dd'
}


class PlantCalendar extends Component {
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
        true: true,
        calendarEvents: null

      };
      this.addPlantToPlot = this.addPlantToPlot.bind(this);
  }

  componentDidMount(){
    console.log(this.props.token);
    // console.log(this.props.zipcode);
    // console.log(this.state.zipcode);
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
                          this.setState({wikipedia_image_final: 'https://target.scene7.com/is/image/Target/52113936_Alt01?wid=520&hei=520&fmt=pjpeg'});
                        } else if(plant_species_image){
                            this.setState({image_message : "null"});
                            console.log(obj.query.pages[0].thumbnail.source);
                            this.setState({wikipedia_image_final: obj.query.pages[0].thumbnail.source});
                        } else {
                          // console.log('No Plant Image to Show');
                          this.setState({image_message : "There is no image available for this plant in our database at this time."});
                          this.setState({wikipedia_image_final: 'https://target.scene7.com/is/image/Target/52113936_Alt01?wid=520&hei=520&fmt=pjpeg'});
                        }
                          // If the search was for Hosta.
                          if(search_term === 'Hosta'){
                            this.setState({wikipedia_image_final: 'https://www.whiteflowerfarm.com/mas_assets/cache/image/3/6/6/f/13935.Jpg'});

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
                                this.setState({wikipedia_image_final: 'https://target.scene7.com/is/image/Target/52113936_Alt01?wid=520&hei=520&fmt=pjpeg'});
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

  getDates(){
    this.setState({
      calendarEvents:
          [
            {
             'title': "Collins night club",
             'allDay': true,
             'start': new Date(2017, 9, 13),
             'end': new Date(2017, 9, 13)
            },
            {
              'title': "Lyman's rockin jazz daddio swingers club",
              'start': new Date(2017, 9, 14, 21, 30 ),
              'end': new Date(2017, 9, 14, 1, 0 ),
              desc: 'Pre-meeting meeting, to prepare for the meeting'
            }
          ]
    });
  }


  componentWillMount() {
    if (this.props.redirection && this.props.redirection[0] !== undefined){
      this.setState({message:this.props.redirection[1]}, ()=>{
        this.props.redirectAction([false, false]);
      });
    }
    console.log(this.props);
    this.getDates();
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


  render() {

    return (
      <div>
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
                <p>Plant Calendar</p>
                {/* {MyCalendar} */}
                  <div>
                    <div>
                      {this.state.calendarEvents &&
                      <BigCalendar
                        events={this.state.calendarEvents}
                        startAccessor='startDate'
                        endAccessor='endDate'
                      />
                      }
                      </div>
                    {/* {this.state.true &&
                      <BigCalendar
                        selectable
                        culture='en'
                        // onSelectEvent={event => this.navigateToEvent(event.bandId, event.eventId)}
                        // events={this.state.calendarEvents}
                        views={['month', 'week', 'day', 'agenda']}/>
                    } */}
                  </div>
                </div>
              </div>
              {/* {this.state.fireredirect && (
                <Redirect to={this.props.redirection[0]}/>
              )} */}
            </div>
          </div>
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

export default connect(mapStateToProps, matchDispatchToProps)(PlantCalendar);
