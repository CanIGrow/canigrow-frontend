import React, { Component } from 'react';
// import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import '../styles/App.css';
import {redirectAction} from '../actions/actions.js';
import cookie from 'react-cookies';
import { Redirect } from 'react-router-dom';
import request from 'superagent';

class EditProfile extends Component {
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
      click:false,
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
      .get(`${proxyurl}https://canigrow.herokuapp.com/api/users/${window.location.href.split("/edit/")[1]}`)
      .end((err, res)=>{
        if (err){
          //If user does not exist:
          this.setState({userexists: false});
        } else if (res !== undefined){
          this.setState({userdata: res.body.user});
        }
      })
    //This adds an edit button if the user matches the saved user token
    if (window.location.href.split("/edit/")[1] === cookie.load("username")
        && window.location.href.split("/edit/")[1] === this.props.username
        && cookie.load("username") === this.props.username){
      this.setState({canedit: true});
    } else {
      this.props.redirectAction([`/`, "Unauthorized"]);
    }
  }
  handleTextChange = (event) => {
    event.preventDefault();
    if (this.state[event.target.id] !== undefined){
      this.setState({[event.target.id]: event.target.value});
    }
  }
  componentDidUpdate(){
    if (this.props.redirection[0] !== undefined && this.props.redirection[0]){
      this.setState({fireredirect:true});
    }
  }
  unauthorized(event){
    this.props.redirectAction([`/`, "Unauthorized"]);
  }
  edituser(event, target, data){
    event.preventDefault();
    if (target === "addnewplot"){
      this.setState({addingnewplot:true})
    }
    if (target === "canceladdnewplot"){
      this.setState({addingnewplot:false})
    }
    if (target === "validate" && data !== "" && data !== undefined){
      let newplot = {
        "name" : data
      }
      const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
      let token = cookie.load("token")
      if (token === this.props.token){
        request
          .post(`${proxyurl}https://canigrow.herokuapp.com/api/plots`)
          .set("Authorization", `Token token=${token}`)
          .send(newplot)
          .end((err, res)=>{
            if (err){
              //If user does not exist:
              window.location.reload();
            } else if (res !== undefined){
              this.setState({addingnewplot: false, newplotname:''});
              this.reloaduser();
            }
          })
      } else {
        window.location.reload();
      }
    }
  }
  clickDiv(el) {
    if (el && el !== undefined){
      el.click()
    }
  }
  render() {
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
      <div id="addnewplot"
        className="userpage-inner-plot-holder">
        <h5>Name of plot:</h5>
        <h4>
        <input type="input" className="userpage-new-plot-name"
          value={this.state.newplotname}
          id="newplotname"
          onChange={this.handleTextChange}/></h4>
          <div className="userpage-plant-div">
          </div>
          <button className="btn-danger"
            onClick={event => this.edituser(event, "canceladdnewplot")}>
          Cancel
          </button>
          <button className="btn-danger"
            onClick={event => this.edituser(event, "validate", this.state.newplotname)}>
          Submit
          </button>
      </div>
    }
    let addplantbutton = "";
    if (this.state.editing && !this.state.dragging){
      addplantbutton =
      <div className="userpage-plant-div">
        <h5 onClick={event => this.edituser(event, "addtoplot")} id="addtoplot"
          className="userpage-plant-div-edit-button">+ Add Plant</h5>
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

    }
    return (
      <div className="userpage-container main-component-container">
      {this.state.click ? (
        <button
        id="elementtoaddthepopupmenu"
         className="content"
         ref={this.clickDiv}
        data-toggle="modal" data-target="#confirmpopup">
        </button>
      ):("")}
      <div className="container">
        <div className="modal top fade in" id="confirmpopup" tabIndex="-1"
        onClick={event => this.cancelmove(event)}>
          <div className="modal-dialog">
            <div className="modal-content text-center">
            <button type="button"
            data-dismiss="modal"
            onClick={event => this.moveplant(event, false)}>
              Move
            </button>
            <button type="button"
            data-dismiss="modal"
            onClick={event => this.moveplant(event, "yes")}>
              Copy
            </button>
            <button type="button"
            data-dismiss="modal"
            aria-label="Close"
            onClick={event => this.cancelmove(event)}>
              Cancel
            </button>
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
      token: state.token,
      username: state.username,
      template: state.template,
      redirection: state.redirection,
      email: state.email
    };
}

function matchDispatchToProps(dispatch){
    // binds the action creation of prop to action. selectUser is a function imported above. Dispatch calls the function.
    return bindActionCreators({redirectAction: redirectAction}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(EditProfile);
