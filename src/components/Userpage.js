import React, { Component } from 'react';
// import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import '../styles/App.css';
import {redirectAction} from '../actions/actions.js';
import cookie from 'react-cookies';
import { Redirect } from 'react-router-dom';
import request from 'superagent';
import trashbin from './trashbin.png';
import trashbinopen from './trashbinopen.png';

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
      plantdragging: false,
      click:false,
      deleting:false,
    };
    this.reloaduser = this.reloaduser.bind(this);
    this.editplots = this.editplots.bind(this);
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
  componentDidUpdate(){
    if (this.props.redirection[0] !== undefined && this.props.redirection[0]){
      this.setState({fireredirect:true});
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
  beginediting(event){event.preventDefault();this.setState({editing: true});}
  finishediting(event){event.preventDefault();
    this.setState({editing:false,addingnewplot:false,newplotname:'',dragging:false,dragto:false,dragfrom:false,plantdragging:false,click:false,deleting:false});
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
  dragover(event){event.preventDefault();event.target.className = 'droppable-div-highlighted';}
  dragexit(event){event.preventDefault();event.target.className = 'droppable-div';}
  dragoverdelete(event){event.preventDefault();event.target.className = 'delete-dropover-child-highlighted';event.target.src = trashbinopen;}
  dragexitdelete(event){event.preventDefault();event.target.className = 'delete-dropover-child';event.target.src = trashbin;}
  drag(event, data, object, plant){
    console.log(data, object, plant);
    if (data === "startdragging"){
      this.setState({dragging:true,dragfrom:object,plantdragging:plant});
    } else if (data === "stopdragging"){
      this.setState({dragging:false});
    } else if (data === "dropped"){
      if (this.state.dragfrom !== object){
        this.setState({dragto:object,click:true});
      } else {
        this.setState({dragging:false,dragfrom:false,plantdragging:false,dragto:false,click:false,deleting:false});
      }
    } else if (data === "delete"){
      this.setState({dragto:object,click:true,deleting:"Plant"});
    } else if (data === "deleteplot"){
      this.setState({dragto:object,click:true,deleting:"Plot"});
    }
  }
  cancelmove(event){
    event.preventDefault();
    this.setState({dragging:false,dragfrom:false,plantdragging:false,dragto:false,click:false,deleting:false});
  }
  clickDiv(el) {
    if (el && el !== undefined){
      el.click()
    }
  }
  editplots(event, copy){
    let plantdata = {}
    const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
    let token = cookie.load("token")
    if (this.state.deleting !== "plot" && token === this.props.token){
      if (copy === "delete"){
        plantdata = {
            "plant_id":this.state.plantdragging.plant_id
          }
      } else {
        plantdata = {
            "plant_id":this.state.plantdragging.plant_id,
            "new_plot":this.state.dragto,
            "copy":copy
          }
      }
      request
        .patch(`${proxyurl}https://canigrow.herokuapp.com/api/plots/${this.state.dragfrom}`)
        .set("Authorization", `Token token=${token}`)
        .send(plantdata)
        .end((err, res)=>{
          if (err){
            window.location.reload();
          } else if (res !== undefined){
            this.setState({dragging:false,dragfrom:false,plantdragging:false,dragto:false,click:false,addingnewplot:false,newplotname:'',deleting:false});
            this.reloaduser();
          }
        })
    } else if (this.state.deleting === "plot" && token === this.props.token){
      request
        .delete(`${proxyurl}https://canigrow.herokuapp.com/api/plots/${this.state.dragfrom}`)
        .set("Authorization", `Token token=${token}`)
        .end((err, res)=>{
          if (err){
            window.location.reload();
          } else if (res !== undefined){
            this.setState({dragging:false,dragfrom:false,plantdragging:false,dragto:false,click:false,addingnewplot:false,newplotname:'',deleting:false});
            this.reloaduser();
          }
        })
    } else {
      window.location.reload();
    }
  }
  editprofileredirect(event, username){
    event.preventDefault();
    this.props.redirectAction([`/edit/${username}`, "Edit"]);
  }
  render() {
    let editbutton = false;
    if (this.state.canedit && !this.state.editing){
      editbutton =
      <div>
        <button className="btn-danger"
        onClick={event => this.beginediting(event)}>Edit Plots</button>
      </div>
    } else if (this.state.canedit && this.state.editing){
      editbutton =
      <div>
        <button className="btn-danger"
        onClick={event => this.finishediting(event)}>Finish Editing Plots</button>
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
      let bio = ""
      if (this.state.userdata.bio !== ""){
        bio = `Bio: ${this.state.userdata.bio}`;
      }
      userobjectdata =
      <div className="container pagination-centered text-center">
        <h2>{this.state.userdata.username}</h2>
        {this.state.canedit ? (
        <div>
          <button className="btn-danger"
          onClick={event => this.editprofileredirect(event, this.state.userdata.username)}>Edit Profile</button>
        </div>
        ):""}
        <p className="userpage-bio-info">{bio}</p>
          <h3>Plots</h3>
          {editbutton}
        <div className="userpage-outer-plots-holder">
          {this.state.userdata.plots.map((plot, i)=>{
            /* {plot_name: "My First Plot", plot_id: 8, plants: Array(1)}*/
            return (
              <div id={plot.plot_id} key={`${plot.plot_name}${plot.plot_id}`} className="userpage-inner-plot-holder">
                <h4>{plot.plot_name}{this.state.editing && (
                  <button type="button"
                    onClick={event => this.drag(event, "deleteplot")}
                    className="close"
                    aria-label="Close">
                    <span aria-hidden="true">  &times;
                    </span>
                  </button>
                  )}
                </h4>
                {plot.plants.map((plant, i)=>{
                  /* {plant_id: 2205, plant: "Silver Moon Clematis"}*/
                  return (
                    <div key={`${plot.plot_name}${plot.plot_id}${plant.plant_id}`}
                      className="userpage-plant-div">
                      {this.state.editing ? (
                        <div draggable="true"
                        onDragStart={event => this.drag(event, "startdragging", plot.plot_id, plant)}
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
                {this.state.dragging && (
                  <div className="droppable-div"
                    onDrop={event => this.drag(event, "dropped", plot.plot_id)}
                    onDragOver={event => this.dragover(event)}
                    onDragLeave={event => this.dragexit(event)}>
                  </div>
                )}
                {this.state.editing && (
                  addplantbutton
                )}
              </div>
            )
          })}
          {addnewplotdivs}
        </div>
      </div>
    }
    return (
      <div className="userpage-container main-component-container">
      {this.state.click && (
        <button
        id="elementtoaddthepopupmenu"
         className="content"
         ref={this.clickDiv}
        data-toggle="modal" data-target="#confirmpopup">
        </button>
      )}
      <div className="container">
        <div className="modal top fade in" id="confirmpopup" tabIndex="-1"
            onClick={event => this.cancelmove(event)}>
          <div className="modal-dialog">
            <div className="modal-content text-center">
        {this.state.deleting ? (
              <button type="button"
              data-dismiss="modal"
              onClick={event => this.editplots(event, "delete")}>
                Delete {this.state.deleting}
              </button>
            ):(
              <button type="button"
              data-dismiss="modal"
              onClick={event => this.editplots(event, false)}>
                Move
              </button>
              <button type="button"
              data-dismiss="modal"
              onClick={event => this.editplots(event, "yes")}>
                Copy
              </button>
            )}
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
      {this.state.dragging && (
        <div className="delete-dropover-parent">
          <img onDrop={event => this.drag(event, "delete")}
            onDragOver={event => this.dragoverdelete(event)}
            onDragLeave={event => this.dragexitdelete(event)}
            className="delete-dropover-child" src={trashbin} alt="DELETE"/>
        </div>
      )}
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
