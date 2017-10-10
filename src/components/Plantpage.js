import React, { Component } from 'react';
import request from 'superagent';
import '../styles/App.css';

export default class Plantpage extends Component {
  constructor(props) {
      super(props)
      this.state = {
        plant_id: 1,
        common_name: null,
        main_image: null,
        wikipedia_image: null,
        wikipedia_image_final: null,
        wikipedia_responseText: null,
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
          this.setState({common_name: res.body.plant.common_name});


          // This obtains an image from wikipedia
          request
           .get(`${proxyurl}https://en.wikipedia.org/w/api.php?action=query&titles=asparagus&prop=images&format=json&imlimit=5`)
           .end((err, res)=>{
            console.log(err);
            console.log(res.xhr);
            console.log(res.xhr.responseText[5]);
            // It's a string.
            console.log(res.xhr.responseText);
            let string = res.xhr.responseText
            let obj = JSON.parse(string);
            console.log(obj.query.pages);
            console.log(obj.query.pages[46319].images);
            console.log(obj.query.pages[46319].images[0].title);
            this.setState({wikipedia_image: obj.query.pages[46319].images[0].title});
            let front = "https://upload.wikimedia.org/wikipedia/commons/8/8d/";
            let premiddle = obj.query.pages[46319].images[0].title;
            // removes the extra front characters
            let middle = premiddle.substring(5);
            console.log(middle);
            let total = front+middle;
            console.log(total);
            this.setState({wikipedia_image_final: total});
           })

          request
           .get(`${proxyurl}https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=$carrot&limit=20&callback=`)
           .end((err, res)=>{
            // console.log(err);
            // console.log(res);
            // console.log(res.response);
            // console.log(res.xhr.responseText);
            this.setState({wikipedia_responseText: res.xhr.responseText});

           })
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

        <img className="plant_big_image" src={this.state.wikipedia_image_final} alt="plant_img"/>
        <p>{this.state.common_name}</p>
        <p>{this.state.wikipedia_responseText}</p>
        <p>{this.state.wikipedia_image}</p>
        <p>Above Image Link:</p>
        <p>{this.state.wikipedia_image_final}</p>
        <img className="plant_big_image" src="https://upload.wikimedia.org/wikipedia/commons/8/8d/2005asparagus.PNG" alt="plant_img"/>


      </div>
    );
  }
}
