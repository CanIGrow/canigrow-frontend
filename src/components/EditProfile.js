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
      userdata: false,
      username: false,
      bio: false,
      location: false,
      location_private: false,
      facebook: false,
      twitter: false,
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
          this.props.redirectAction([`/`, "Unauthorized"]);
        } else if (res !== undefined){
          console.log(res.body.user);
          this.setState({userdata:res.body.user,username:res.body.user.username,bio:res.body.user.bio,location:res.body.user.location,location_private:res.body.user.location_private,facebook:res.body.user.facebook,twitter:res.body.user.twitter,});
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
  validate(event) {
    event.preventDefault();
  }
  render() {
    return (
      <div className="editprofile-container main-component-container">
        <h2>Edit Profile</h2>
        <form className="enterForm" onSubmit={this.handleFormSubmit}>
          <div className="form-group">
            <h6>User Name:</h6>
            <input type="text" onChange={this.handleTextChange} value={this.state.username} id="username" placeholder="Username"/>
          </div>
          {this.state.usernameinputerror ? this.state.usernameinputerror : ""}
          <div className="form-group">
            <h6>Personal Bio:</h6>
            <textarea type="text" onChange={this.handleTextChange} value={this.state.bio} id='bio' className='wmd-input processed' name='post-text' cols='50' rows='5' tabIndex='101' data-min-length placeholder='Tell Us About Yourself'></textarea>
          </div>
          <div className="form-group">
            <h6>Location:</h6>
            <input type="text" onChange={this.handleTextChange} value={this.state.location} id="location" placeholder="Hometown, Region"/>
          </div>
          <div className="form-group">
            <h6>Location Private</h6>
            <input type="checkbox" onChange={this.handleTextChange} value={this.state.location_private} id="location_private"/>
          </div>
          <div className="form-group">
            <h6>Facebook Link:</h6>
            <input type="text" onChange={this.handleTextChange} value={this.state.facebook} id="facebook" placeholder="Hometown, Region"/>
          </div>
          <div className="form-group">
            <h6>Twitter Link:</h6>
            <input type="text" onChange={this.handleTextChange} value={this.state.twitter} id="twitter" placeholder="Hometown, Region"/>
          </div>
          <div className="form-group pull-right">
            <button className="btn btn-primary btn-lg" type="submit" onClick={event => this.validate(event)}>Save Changes</button>
          </div>
        </form>
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
      redirection: state.redirection,
      email: state.email
    };
}

function matchDispatchToProps(dispatch){
    // binds the action creation of prop to action. selectUser is a function imported above. Dispatch calls the function.
    return bindActionCreators({redirectAction: redirectAction}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(EditProfile);
