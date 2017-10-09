import React, { Component } from 'react';
import request from 'superagent';
import '../styles/App.css';

export default class Plantpage extends Component {


  plantInfoGet(event) {
    //  This lets the user 'bypass' CORs via proxy.
     const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
     let plant_id = 1;
    //  event.preventDefault();
     request
      .get(`${proxyurl}https://canigrow.herokuapp.com/api/plants/${plant_id}`)
      .end((err, res)=>{
        if (res !== undefined){
          console.log(res.body);
        }
      })
  }

  componentWillMount() {
    console.log(this.props);
    this.plantInfoGet();
  }


  render() {
    return (
      <div className="plantpage-container main-component-container">
        <h1>This is a Plantpage</h1>
      </div>
    );
  }
}
