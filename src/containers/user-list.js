// testing file from: https://github.com/buckyroberts/React-Redux-Boilerplate/blob/master/dev/js/containers/user-list.js
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {selectUser} from '../actions/exampleAction.js'


class UserList extends Component {

  // the users data comes from mapStateToProps below.
    renderList() {
        return this.props.users.map((user) => {
            return (
                <li
                    key={user.id}
                    onClick={() => this.props.selectUser(user)}
                >
                    {user.first} {user.last}
                </li>
            );
        });
    }

    render() {
        return (
            <ul>
              <div>test text from user-list</div>
                {this.renderList()}
            </ul>
        );
    }

}

// Get apps state from App.js which is from indexReducer, and then pass it as props to UserList
//      > whenever state changes, the UserList will automatically re-render

// Passes information as state
function mapStateToProps(state) {
    return {
        users: state.users
    };
}

// Get actions and pass them as props to to UserList
//      > now UserList has this.props.selectUser

// Passes information as a prop
function matchDispatchToProps(dispatch){
  // binds the action creation of prop to action. selectUser is a function imported above. Dispatch calls the function.
    return bindActionCreators({selectUser: selectUser}, dispatch);
}

// We don't want to return the plain UserList (component) anymore, we want to return the smart Container
//      > UserList is now aware of state and actions

// This connects mapStateToProps to UserList component (dumb component to smart component or container).
// export default connect(mapStateToProps)(UserList);
export default connect(mapStateToProps, matchDispatchToProps)(UserList);
