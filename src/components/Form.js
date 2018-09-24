import React, { Component } from 'react';

class Form extends Component {
  render () {
    return (
      <form className="form" onSubmit={this.props.handleSubmit}>
        <div className="field">
          <p className="control is-expanded has-icons-left">
            <input
              className={this.props.invalid || this.props.unavailable ? 'input invalid-input' : 'input'}
              placeholder="Longitude, Latitude"
              type="text"
              name="search"
              required
            />
            <span className="icon is-small is-left">
              <i className="fas fa-map-marker-alt"></i>
            </span>
          </p>
        </div>
        <div className="control">
          <button className="button is-primary is-fullwidth">
            Search
          </button>
        </div>
        <p className={this.props.invalid ? 'help is-danger' : 'help is-danger is-hidden'}>
          Input is invalid.
        </p>
        <p className={this.props.unavailable ? 'help is-danger' : 'help is-danger is-hidden'}>
          Images for the following coordinates are not available.
        </p>
      </form>
    );
  };
};

export default Form;
