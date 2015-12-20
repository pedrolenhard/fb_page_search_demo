'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');

var APP_ACCESS_TOKEN = '924314550989801|JZbwxfRSyxsDKxIK44cBDUlEWs0';
var PAGE_SEARCH_URL = 'https://graph.facebook.com/search';


var Page = React.createClass({
  render: function() {
    var generateDescription = function(description) {
      if (!description) { return null; }
      var shortDesc = ('' + description).substring(0, 140);
      return shortDesc + '\u2026';
    };
    return (
      <div className="page">
        <img src={ '' + this.props.photo }></img>
        <a href={ '' + this.props.link }>
          { this.props.name }
        </a>
        <p className = "pageDescription">
        { generateDescription(this.props.description) }
        </p>
        <p className= "likes">
          Likes: { this.props.likes }
        </p>
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
        <Page name={page.name} likes={page.likes}
        link={page.link} description={page.description}
        photo={page.picture.data.url} key={page.id}>
        </Page>
      );
    });
    if (this.props.searchResults.length > 0) {
      return (
        <div className="searchResultList">
        <p>{ this.props.searchResults.length } Results Found:</p>
        { pageNodes }
        </div>
      );
    }
    return null; // display nothing otherwise
  }
});

var SearchSection = React.createClass({
  getInitialState: function() {
    return { searchResults: [], loading: false, hasError: false };
  },
  handleSearchSubmit: function(input) {
    var self = this;
    self.setState( {
      searchResults: [],
      loading: true,
      hasError: false
    });
    $.ajax({
      method: 'GET',
      url: PAGE_SEARCH_URL,
      data: {
        type: 'page',
        fields: 'name,id,likes,picture,link,description',
        limit: 25,
        q: input.keyword,
        access_token: APP_ACCESS_TOKEN
      }
    })
    .then(function(result) {
      self.setState( {
        searchResults: result.data,
        loading: false,
        hasError: false
      });
    }, function(xhr, status, err) {
      self.setState( {
        searchResults: [],
        loading: false,
        hasError: true
      });
      console.log('Error: ' + xhr.status + ' ' + err.toString());
    });
  },
  showLoadMessage: function() {
    if (this.state.loading) {
      return (
        <p className="loadMessage">Loading&hellip;</p>
      );
    }
    return null; // display nothing otherwise
  },
  showErrorMessage: function() {
    if (this.state.hasError) {
      return (
        <p className="errorMessage">
        An error has occurred. Please try searching again.
        </p>
      );
    }
    return null; // display nothing otherwise
  },
  render: function() {
    return (
      <div className="searchSection">
        <h1>Page Explorer</h1>
        <SearchForm onSearchSubmit={this.handleSearchSubmit} />
        { this.showLoadMessage() }
        { this.showErrorMessage() }
        <SearchResultList searchResults={this.state.searchResults} />
      </div>
    );
  }
});


ReactDOM.render(
  <SearchSection />,
  document.getElementById('content')
);
