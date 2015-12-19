'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');

var APP_ACCESS_TOKEN = '924314550989801|JZbwxfRSyxsDKxIK44cBDUlEWs0';
var PAGE_SEARCH_URL = 'https://graph.facebook.com/search';

/*
 https://graph.facebook.com/search?type=page&
 fields=name,id,likes,picture&limit=25&
 q=[search_string]&access_token=APP_ACCESS_TOKEN
*/

var Page = React.createClass({
  render: function() {
    return (
      <div className="page">
        <h2 className="pageName">
          { this.props.name }
        </h2>
        <span className= "likes">
          Likes: { this.props.likes }
        </span>
      </div>
    );
  }
});

var SearchForm = React.createClass({
  getInitialState: function() {
    return { keyword: '' };
  },
  handleInputChange: function(e) {
    this.setState({ keyword: e.target.value });
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var keyword = this.state.keyword.trim();
    if (!keyword) { return; }
    this.props.onSearchSubmit({ keyword: keyword });
    this.setState({ keyword: '' }); // clear input
  },
  render: function() {
    return(
      <div className = "searchFormSection">
        <form className="searchForm" onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Enter the name of the page you seek"
            value={this.state.keyword}
            onChange={this.handleInputChange}
          />
          <input type="submit" value="Search" />
        </form>
      </div>
    );
  }
});

var SearchResultList = React.createClass({
  render: function() {
    var pageNodes = this.props.searchResults.map(function(page) {
      return (
        <Page name={page.name} likes={page.likes} key={page.id}>
        </Page>
      );
    });
    return (
      <div className="searchResultList">
        { pageNodes }
      </div>
    );
  }
});

var SearchSection = React.createClass({
  getInitialState: function() {
    return { searchResults: [] };
  },
  handleSearchSubmit: function(input) {
    var self = this;
    $.ajax({
      method: 'GET',
      url: PAGE_SEARCH_URL,
      data: {
        type: 'page',
        fields: 'name,id,likes,picture',
        limit: 25,
        q: input.keyword,
        access_token: APP_ACCESS_TOKEN
      }
    })
    .then(function(result) {
      self.setState( { searchResults: result.data });
    }, function(error) {
      console.log('Error: ' + error);
    });
  },
  render: function() {
    return (
      <div className="searchSection">
        <h1>Page Explorer</h1>
        <SearchForm onSearchSubmit={this.handleSearchSubmit} />
        <SearchResultList searchResults={this.state.searchResults} />
      </div>
    );
  }
});


ReactDOM.render(
  <SearchSection />,
  document.getElementById('content')
);
