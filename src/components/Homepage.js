import React, { Component } from 'react';
import '../styles/App.css';

export default class Homepage extends Component {
  render() {
    return (
      <div className="homepage-container main-component-container">
        <form>
          <div className="homepage-search-container container">
            <div className="pagination-centered">
              <h2 className="homepage-search-title">Can I Grow
              <input type="search" className="homepage-search-box"/>
              </h2>
            </div>
          </div>
        </form>
        <h1>This is a Homepage</h1>
      </div>
    );
  }
}
