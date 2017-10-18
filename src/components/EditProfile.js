import React, { Component } from 'react';
// import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import '../styles/App.css';
import {redirectAction} from '../actions/actions.js';
import cookie from 'react-cookies';
import { Redirect } from 'react-router-dom';
import request from 'superagent';
// import FileInput from 'react-file-input';

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
          if (res.body.user.facebook === null){res.body.user.facebook = ""};
          if (res.body.user.twitter === null){res.body.user.twitter = ""};
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
  handleCheckboxChange = (event) => {
    this.setState({location_private: !this.state.location_private});
  }
  validate(event) {
    event.preventDefault();
    let token = cookie.load("token");
    const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
    let userobj = {
      "user": {
          "bio": this.state.bio,
          "location": this.state.location,
          "location_private":this.state.location_private,
          "facebook":this.state.facebook,
          "twitter":this.state.twitter,
          }
        }
    request
      .patch(`${proxyurl}https://canigrow.herokuapp.com/api/users/${this.props.username}`)
      .set("Authorization", `Token token=${token}`)
      .send(userobj)
      .end((err, res) => {
        if (err) {
          this.props.redirectAction([`/`, "Unauthorized"]);
        } else if (res !== undefined && res.status == 200){
          this.props.redirectAction([`/user/${this.props.username}`, "Profile Edited"]);
        } else {
          this.props.redirectAction([`/`, "Unauthorized"]);
        }
      })
  }
  handleChange = (event) => {
    console.log('Selected file:', event.target.files[0]);
  }
  render() {
    return (
      <div className="editprofile-container main-component-container">
        <div className="card pagination-centered text-center">
          <h2>Edit Profile</h2>
          <h4>User Name: {this.state.username}</h4>
          <form className="enterForm" onSubmit={this.validate}>
            <div className="form-group">
              <h6>Avatar:</h6>
              {/*<input onChange={(event)=> { this.readFile(event, this.files) }} name="myFile" type="file"/>*/}
            {/*  <FileInput name="myImage"
                   accept=".png,.gif"
                   placeholder="My Image"
                   className="inputClass"
                   onChange={this.handleChange} />*/}
            </div>
            <div className="form-group">
              <h6>Personal Bio:</h6>
              <textarea type="text" onChange={this.handleTextChange} value={this.state.bio} id='bio' className='wmd-input processed' name='post-text' cols='50' rows='5' tabIndex='101' data-min-length placeholder='Tell Us About Yourself'></textarea>
            </div>
            <div className="form-group">
              <h6>Location:</h6>
              <input type="text" onChange={this.handleTextChange} value={this.state.location} id="location" placeholder="Hometown, Region"/>
            </div>
            <div className="form-group">
              <h6>Location Privacy:
                <input type="checkbox" onChange={this.handleCheckboxChange} checked={this.state.location_private} value={this.state.location_private} id="location_private"/>
              </h6>
            </div>
            <div className="form-group">
              <h6>Facebook Link:</h6>
              <input type="text" onChange={this.handleTextChange} value={this.state.facebook} id="facebook" placeholder="Facebook Link"/>
            </div>
            <div className="form-group">
              <h6>Twitter Link:</h6>
              <input type="text" onChange={this.handleTextChange} value={this.state.twitter} id="twitter" placeholder="Twitter Link"/>
            </div>
            <div className="form-group pull-right">
              <button className="btn btn-primary btn-lg" type="submit" onClick={event => this.validate(event)}>Save Changes</button>
            </div>
          </form>
          {this.state.fireredirect && (
              <Redirect to={this.props.redirection[0]}/>
            )}
        </div>
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
