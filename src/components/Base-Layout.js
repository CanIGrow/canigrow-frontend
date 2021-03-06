import React, { Component } from 'react';
import '../styles/App.css';
import Header from './Header.js';
import Footer from './Footer.js';
// import '../srcImages';
// import cookie from 'react-cookies';
// import {connect} from 'react-redux';
// import {bindActionCreators} from 'redux';
// import {reloadToken} from '../actions/reloadToken.js';

export default class BaseLayout extends Component {
  constructor(props) {
      super(props)
      this.state = {
        username: '',
        token: this.props.token,
        template: this.props.template,
      };
  }

  render() {
    // console.log(this.props);
    let style_number = this.props.template;
    style_number = parseInt(style_number, 10);
    // console.log(style_number);
    let outerStyle = null;
    if(style_number === 1){
      outerStyle = {
          "backgroundColor": "#ADD8E6",
          "minHeight" : "800px"
      }
    } else if (style_number === 2) {
      outerStyle = {
          "backgroundImage": "url(http://33.media.tumblr.com/d629b615957dd93e460a9170b802fd28/tumblr_n9jk2qAjGS1s4fz4bo1_500.gif)",
          "minHeight" : "800px"
      }
    } else if (style_number === 3) {
      outerStyle = {
          "backgroundImage": "url(http://31.media.tumblr.com/tumblr_mbfs7bd2q31rwjzpqo1_500.gif)",
          "minHeight": "800px",
          "fontFamily": '"STARWARS", Georgia, Times'
      }
    } else if (style_number === 4) {
      outerStyle = {
          "backgroundImage": "url(http://i.imgur.com/StjVqhS.gif)",
          "backgroundSize": "800px 800px",
          "minHeight": "800px"
      }
    } else if (style_number === 5) {
      outerStyle = {
          "backgroundImage": "url(https://i.imgur.com/RwbSwuz.gif)",
          "backgroundSize": "1000px 800px",
          "minHeight": "800px"
      }
    } else if (style_number === 6) {
      outerStyle = {
          "backgroundImage": "url(https://i.imgur.com/f7wQeCh.gif)",
          "backgroundSize": "1000px 800px",
          "minHeight": "800px"
      }
    } else if (style_number === 7) {
      outerStyle = {
          "backgroundImage": "url(https://i.imgur.com/dnoCKaR.gif)",
          "backgroundSize": "1000px 800px",
          "minHeight": "800px"
      }
    }
    else {
      outerStyle = {
          "backgroundColor": "#D3D3D3",
          // "backgroundImage": 'url(https://i.imgur.com/fW194uY.jpg)',
          // "backgroundImage": 'url(http://www.loversiq.com/daut/as/f/f/flowers-nature-plant-beautiful-green-red-yellow-pink-blue-1811457_beautiful-plants_home-decor_target-home-decor-decorating-blogs-inexpensive-fall-websites-walmart-pinterest-decorator.jpg)',
          "width": "100%",
          "height": "100%",
          // "-webkit-background-size": "cover",
          // "-moz-background-size": "cover",
          // "-o-background-size": "cover",
          //  "background-size": "cover",

          // "backgroundColor": "#EEEEEE",
          // "backgroundColor": "#5D711F",
          // "backgroundColor": "#60AC68",
          // "backgroundColor": "blue",
          "minHeight": "800px"
      }
    }

    return (
      <div className="body" style={outerStyle}>
        <Header />
        <div className="fill_page">
          {this.props.children}
        </div>
        <Footer />
      </div>
    );
  }
}

// function mapStateToProps(state) {
//     return {
//       token: state.token,
//       username: state.username,
//       template: state.template
//     };
// }
//
// connect(mapStateToProps)
