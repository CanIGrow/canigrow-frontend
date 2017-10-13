import React, { Component } from 'react';
// import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import '../styles/App.css';
import {changeTemplate,redirectAction} from '../actions/actions.js';
import cookie from 'react-cookies';
import { Redirect } from 'react-router-dom';
import request from 'superagent';

class Userpage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fireredirect: false,
      message: false,
      userexists: true,
      username: this.props.username,
      user: null,
      userdata: false,
      template: this.props.template,
      bio: '',
      canedit: false,
      editing: false,
      addingnewplot: false,
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
    //This adds an edit button if the user matches the saved user token
    if (window.location.href.split("/user/")[1] === cookie.load("username")
        && window.location.href.split("/user/")[1] === this.props.username
        && cookie.load("username") === this.props.username){
      this.setState({canedit: true});
    }
  }
  handleTextChange = (event) => {
    event.preventDefault();
    if (this.state[event.target.id] !== undefined){
      this.setState({[event.target.id]: event.target.value});
    }
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
      this.setState({[event.target.id]: event.target.value, passworderror: false});
    }
  }
  beginediting(event){
    event.preventDefault();
    this.setState({editing: true});
  }
  edituser(event, target){
    event.preventDefault();
    // const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
    console.log(target);
    if (target === "addnewplot"){
      this.setState({addingnewplot:true})
    }
  }

  render() {
    let editbutton = false;
    if (this.state.canedit && !this.state.editing){
      editbutton =
      <div>
        <button className="btn-danger"
        onClick={event => this.beginediting(event)}>Edit</button>
      </div>
    }
    let addnewplotdivs = false;
    if (this.state.editing && !this.state.addingnewplot){
      addnewplotdivs =
      <div onClick={event => this.edituser(event, "addnewplot")}
        id="addnewplot"
        className="userpage-new-plot userpage-inner-plot-holder">
        <h4>Add a new plot</h4>
          <div className="userpage-plant-div">
            <h5>+</h5>
          </div>
      </div>
    } else if (this.state.editing && this.state.addingnewplot){
      addnewplotdivs =
      <div onClick={event => this.edituser(event, "validate")}
        id="addnewplot"
        className="userpage-new-plot userpage-inner-plot-holder">
        <h4 onClick={event => this.edituser(event, "addnewplot")}>
        <input type="input" className="userpage-new-plot-name"
          value={this.state.searchbartext}
          onChange={this.handleTextChange}/></h4>
          <div className="userpage-plant-div">
            <h5>+ Add Plant</h5>
          </div>
      </div>
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
        {this.state.passworderror ? (<p>Incorrect Password</p>):""}
        <p className="userpage-bio-info">{bio}</p>
          <h3>Plots</h3>
          {editbutton}
        <div className="userpage-outer-plots-holder">
          {this.state.userdata.plots.map((plot, i)=>{
            /* {plot_name: "My First Plot", plot_id: 8, plants: Array(1)}*/
            return (
              <div key={`${plot.plot_name}${plot.plot_id}`} className="userpage-inner-plot-holder">
                <h4>{plot.plot_name}</h4>
                {plot.plants.map((plant, i)=>{
                  /* {plant_id: 2205, plant: "Silver Moon Clematis"}*/
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
                {this.state.editing ? (
                  <div className="userpage-plant-div">
                    <h5 onClick={event => this.edituser(event, "addtoplot")} id="addtoplot"
                      className="userpage-plant-div-edit-button">+ Add Plant</h5>
                  </div>
                ):("")}
              </div>
            )
          })}
          {addnewplotdivs}
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
      email: state.email
    };
}

function matchDispatchToProps(dispatch){
    // binds the action creation of prop to action. selectUser is a function imported above. Dispatch calls the function.
    return bindActionCreators({changeTemplate: changeTemplate, redirectAction: redirectAction}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Userpage);
