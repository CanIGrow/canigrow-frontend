import React, { Component } from 'react';
// import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import '../styles/App.css';
import {redirectAction} from '../actions/actions.js';
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
      newplotname: '',
      dragging: false,
      dragto: false,
      dragfrom: false,
      plantdragging: false
    };
    this.reloaduser = this.reloaduser.bind(this);
    this.moveplant = this.moveplant.bind(this);
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
        } else if (res !== undefined){
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
  reloaduser(){
    const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
    request
      .get(`${proxyurl}https://canigrow.herokuapp.com/api/users/${window.location.href.split("/user/")[1]}`)
      .end((err, res)=>{
        if (err){
          //If user does not exist:
          this.setState({userexists: false});
        } else if (res !== undefined){
          this.setState({userdata: res.body.user});
        }
      })
  }
  handleTextChange = (event) => {
    event.preventDefault();
    if (this.state[event.target.id] !== undefined){
      this.setState({[event.target.id]: event.target.value});
    }
  }
  updateFromField(stateKey) {
      return (event) => {
        this.setState({[stateKey]: event.target.value});
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
  beginediting(event){
    event.preventDefault();
    this.setState({editing: true});
  }
  finishediting(event){
    event.preventDefault();
    this.setState({editing: false,addingnewplot: false,newplotname: '',dragging:false,dragto:false,dragfrom:false,plantdragging:false});
  }
  edituser(event, target, data){
    event.preventDefault();
    // const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
    if (target === "addnewplot"){
      this.setState({addingnewplot:true})
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
              console.log(res);
              this.setState({addingnewplot: false, newplotname:''});
              this.reloaduser();
            }
          })
      } else {
        window.location.reload();
      }
    }
  }
  dragover(event){event.preventDefault();}
  drag(event, data, object, plant){
    // event.preventDefault();
    // console.log(event.target);
    console.log(data);
    // console.log(object);
    if (data === "startdragging"){
      this.setState({dragging:true,dragfrom:object,plantdragging:plant});
    } else if (data === "stopdragging"){
      this.setState({dragging:false});
    } else if (data === "dropped"){
      this.setState({dragto:object}, ()=>{
        this.moveplant();
      });
    }
  }
  moveplant(){
    this.state.userdata.plots.map((plot, i)=>{
      console.log(plot);
    })
    console.log(this.state.plantdragging);
    console.log(this.state.dragfrom);
    console.log(this.state.dragto);
  }
  render() {
    let editbutton = false;
    if (this.state.canedit && !this.state.editing){
      editbutton =
      <div>
        <button className="btn-danger"
        onClick={event => this.beginediting(event)}>Edit</button>
      </div>
    } else if (this.state.canedit && this.state.editing){
      editbutton =
      <div>
        <button className="btn-danger"
        onClick={event => this.finishediting(event)}>Finish Editing</button>
        <p>Click and drag plants to move, copy, or delete them!</p>
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
            onClick={event => this.edituser(event, "validate", this.state.newplotname)}>
          Submit
          </button>
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
              <div id={plot.plot_id} key={`${plot.plot_name}${plot.plot_id}`} className="userpage-inner-plot-holder">
                <h4>{plot.plot_name}</h4>
                {plot.plants.map((plant, i)=>{
                  /* {plant_id: 2205, plant: "Silver Moon Clematis"}*/
                  return (
                    <div key={`${plot.plot_name}${plot.plot_id}${plant.plant_id}`}
                      className="userpage-plant-div">
                      {this.state.editing ? (
                        <div draggable="true"
                        onDragStart={event => this.drag(event, "startdragging", plot.plot_id, plant.plant_id)}
                        onDragEnd={event => this.drag(event, "stopdragging")}
                        className="userpage-plant-link">
                        <h5>{plant.plant}</h5>
                        </div>
                      ):(
                        <a onClick={event => this.props.redirectAction(["/plants/"+plant.plant_id, ""])}
                          className="userpage-plant-link">
                        <h5>{plant.plant}</h5>
                        </a>
                      )}
                    </div>
                  )
                })}
                {/*
onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop
onMouseDown onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp
*/}
                {this.state.dragging ? (
                  <div className="droppable-div"
                  onDrop={event => this.drag(event, "dropped", plot.plot_id)}
                  onDragOver={event => this.dragover(event)}>
                  </div>
                ):("")}
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
    return (
      <div className="userpage-container main-component-container">
        {userobjectdata}
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

export default connect(mapStateToProps, matchDispatchToProps)(Userpage);
