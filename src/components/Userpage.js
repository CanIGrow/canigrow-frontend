import React, { Component } from 'react';
// import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import '../styles/App.css';
import {changeTemplate} from '../actions/reloadToken.js';
import {redirectAction} from '../actions/redirectionAction.js';
import cookie from 'react-cookies';
import { Redirect } from 'react-router-dom';
import request from 'superagent';

class Userpage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fireredirect: false,
      userexists: true,
      canedit: false,
      password: '',
      passwordconfirmation: false,
      message: false,
      username: this.props.username,
      user: null,
      userdata: false,
      template: this.props.template,
      bio: ''
    };
  }

  componentWillMount() {
    if (this.props.redirection && this.props.redirection[0] !== undefined){
      this.setState({message:this.props.redirection[1]}, ()=>{
        this.props.redirectAction([false, false]);
      });
    }
    const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
    //This request gets the users information
    request
      .get(`${proxyurl}https://canigrow.herokuapp.com/api/users/${window.location.href.split("/user/")[1]}`)
      .end((err, res)=>{
        if (err){
          //If user does not exist:
          this.setState({userexists: false});
        }
        if (res !== undefined){
          this.setState({userdata: res.body.user});
        }
      })
    //This request authorizes the user if they are logged in
    if (window.location.href.split("/user/")[1] === cookie.load("username")){
      this.setState({canedit: true});
    }
    // request
    //   .get(`${proxyurl}https://canigrow.herokuapp.com/api/users/${window.location.href.split("/user/")[1]}`)
    //   .end((err, res)=>{
    //     if (err){
    //       //If user does not exist:
    //       this.setState({userexists: false});
    //     }
    //     if (res !== undefined){
    //       this.setState({userdata: res.body.user});
    //     }
    //   })
  }

  updateFromField(stateKey) {
      return (event) => {
        this.setState({[stateKey]: event.target.value},()=>{
          this.updateTemplate();
        });
      }
    }

  updateTemplate() {
    console.log(this.props.template);
    let changeTemplate = this.props.changeTemplate;
    changeTemplate(this.state.template);
    this.props.newTemplate(this.state.template);
    console.log(this.props.template);
    console.log(this.props);
  }
  componentDidUpdate(){
    if (this.props.redirection[0] !== undefined && this.props.redirection[0]){
      this.setState({fireredirect:true});
    }
  }
  handleTextChange = (event) => {
    event.preventDefault();
    if (this.state[event.target.id] !== undefined){
      this.setState({[event.target.id]: event.target.value});
    }
  }
  edituser(event){
    event.preventDefault();
    if (!this.state.passwordconfirmation){
      this.setState({passwordconfirmation:true});
    } else if (this.state.passwordconfirmation && this.state.password !== ''){

    }
  }
  render() {
    let edittext = "Edit";
    if (this.state.passwordconfirmation){
      edittext = "Confirm Password"
    }
    let userobjectdata = false;
    if (!this.state.userexists){
      userobjectdata =
        <h1 className="pagination-centered text-center">
          User Does Not Exist
        </h1>
    } else if (!this.state.userdata){
      userobjectdata =
        <h1 className="pagination-centered text-center">
          Loading...
        </h1>
    } else {
      let bio = ""
      if (this.state.userdata.bio !== ""){
        bio = `Bio: ${this.state.userdata.bio}`;
      }
      userobjectdata =
      <div className="container pagination-centered text-center">
        <h2>{this.state.userdata.username}</h2>
        {this.state.passwordconfirmation ? (
          <input type="password" onChange={this.handleTextChange} id="password" value={this.state.password} placeholder="********"/>
        ):("")}
        {this.state.canedit ? (
          <button className="btn-danger"
            onClick={event => this.edituser(event)}>{edittext}</button>
        ):("")}
        <p className="userpage-bio-info">{bio}</p>
        <div className="userpage-outer-plots-holder">
          <h3>Plots</h3>
          {this.state.userdata.plots.map((plot, i)=>{
            console.log(plot);
            return (
              <div key={`${plot.plot_name}${plot.plot_id}`} className="userpage-inner-plot-holder">
                <h4>{plot.plot_name}</h4>
                {plot.plants.map((plant, i)=>{
                  console.log(plant);
                  return (
                    <div key={`${plot.plot_name}${plot.plot_id}${plant.plant_id}`}
                      className="userpage-plant-div">
                      <a onClick={event => this.props.redirectAction(["/plants/"+plant.plant_id, ""])}
                        className="userpage-plant-link">
                      <h5>{plant.plant}</h5>
                      </a>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    }
    let askQuestion = {
        "marginTop": "30pt",
    }
    return (
      <div className="userpage-container main-component-container">
        {userobjectdata}
        <div style={askQuestion}>
                    <div>Change the Background</div>
                    <form >
                      {/* onSubmit={this.handleSubmit} */}
                    <select name="templates" onChange={this.updateFromField('template')} value={cookie.load('template')}>
                      <option value="0">Classic</option>
                      <option value="1">Blue</option>
                      <option value="2">Shooting Stars</option>
                      <option value="3">Twinkle Stars</option>
                      <option value="4">Mountains</option>
                      <option value="5">Reef</option>
                      <option value="6">Rain Drops</option>
                      <option value="7">Cherry Blossom</option>
                    </select>
                    <br/>
                    {/* onClick={event => this.updateTemplate(event)} */}
                    </form>
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
      token: state.token,
      username: state.username,
      template: state.template,
      redirection: state.redirection,
    };
}

function matchDispatchToProps(dispatch){
    // binds the action creation of prop to action. selectUser is a function imported above. Dispatch calls the function.
    return bindActionCreators({changeTemplate: changeTemplate, redirectAction: redirectAction}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Userpage);
