import React, { Component } from 'react';
import request from 'superagent';
import '../styles/App.css';

export default class Plantpage extends Component {
  constructor(props) {
      super(props)
      this.state = {
        plant_id: 1,
      };
  }

  plantInfoGet(event) {
    //  This lets the user 'bypass' CORs via proxy.
     const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
     event.preventDefault();
     request
      .get(`${proxyurl}https://canigrow.herokuapp.com/api/plants/${this.state.plant_id}`)
      .end((err, res)=>{
        if (res !== undefined){
          console.log(res.body);
        }
      })
  }

  componentWillMount() {
    console.log(this.props);
  }

  updateFromField(stateKey) {
      return (event) => {
        this.setState({[stateKey]: event.target.value});
      }
  }

  render() {
    return (
      <div className="plantpage-container main-component-container">
        <p>This is a Plantpage</p>
        <form className="enterForm" onSubmit={this.handleFormSubmit}>
          <div className="form-group">
            <h6>Plant ID:</h6>
            <input type="text" onChange={this.updateFromField('plant_id')} value={this.state.plant_id} placeholder="plant_id"/>
          </div>
          <div className="form-group pull-right">
            <button className="btn btn-primary btn-lg" type="submit" onClick={event => this.plantInfoGet(event)}>Get Plant Information</button>
          </div>
        </form>

        <img className="plant_big_image" src="" alt="plant_img"/>


      </div>
    );
  }
}
