import React, { Component } from 'react';
import axios from 'axios';
import Form from './Form';

class Map extends Component {
  constructor (props) {
    super(props);
    this.state = {
      tiles: [],
      invalid: false,
      unavailable: false,
      loading: false
    };
  };

  nasa = (data = {latitude: 47.61, longitude: -122.34}) => {
    const url = 'https://api.nasa.gov/planetary/earth/imagery';
    const key = 'sTlrR6AQvGdqplpbFQ8NVae9g4Vjh0OxCuHrm0lv';
    const date = '2014-02-01';
    const size = 0.05;

    const latitude = [data.latitude - size, data.latitude, data.latitude + size];
    const longitude = [data.longitude - size, data.longitude, data.longitude + size];

    const tiles = [
      {latitude: latitude[2], longitude: longitude[0]},
      {latitude: latitude[2], longitude: longitude[1]},
      {latitude: latitude[2], longitude: longitude[2]},
      {latitude: latitude[1], longitude: longitude[0]},
      {latitude: latitude[1], longitude: longitude[1]},
      {latitude: latitude[1], longitude: longitude[2]},
      {latitude: latitude[0], longitude: longitude[0]},
      {latitude: latitude[0], longitude: longitude[1]},
      {latitude: latitude[0], longitude: longitude[2]}
    ];

    return Promise.all(tiles.map(tile => {
      this.setState({tiles: [], invalid: false, unavailable: false, loading: true});
      return axios(`${url}?lon=${tile.longitude}&lat=${tile.latitude}&date=${date}&dim=${size}&api_key=${key}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
    }))
    .catch(error => {
      this.setState({tiles: [], invalid: false, unavailable: true, loading: false});
      return Promise.reject(error);
    });
  };

  renderMap = coordinates => {
    this.nasa(coordinates)
    .then(response => {
      this.setState({tiles: response.map(tile => tile.data.url), loading: false});
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const coordinates = event.target.search.value.split(',');
    if (coordinates.length === 2) {
      const latitude = Number(coordinates[0].trim());
      const longitude = Number(coordinates[1].trim());
      if (
        typeof latitude === 'number' && typeof longitude === 'number' &&
        latitude <= 90 && latitude >= -90 &&
        longitude <= 180 && longitude >= -180
      ) {
        this.renderMap({latitude: latitude, longitude: longitude});
      } else {
        this.setState({tiles: [], invalid: true, unavailable: false, loading: false});
      }
    } else {
      this.setState({tiles: [], invalid: true, unavailable: false, loading: false});
    }
  };

  render () {
    return (
      <div>
        <section className="hero is-dark is-bold is-fullheight">
          <div className="hero-body">
            <div className="container">
              <div className="columns">
                <div className="column is-8 is-offset-2">
                  <span className="lnr lnr-earth has-text-centered"></span>
                  <h1 className="title is-1 has-text-centered">Aeria</h1>
                  <p className="subtitle is-5 has-text-centered">
                    Search anywhere in the world by entering coordinates!
                  </p>
                  <Form
                    handleSubmit={this.handleSubmit}
                    invalid={this.state.invalid}
                    unavailable={this.state.unavailable}
                  />
                  <br />
                  {
                    this.state.loading ? (
                      <div className="has-text-centered">
                        <div className="lds-default">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      </div>
                    ) : null
                  }
                </div>
              </div>
            </div>
          </div>
          {
            this.state.tiles.length < 1 && !this.state.loading ? null : (
              <div className="hero-foot has-text-centered">
                {
                  !this.state.loading ? (
                    <a href="#map">
                      <small>
                        View Map
                      </small>
                      <span className="lnr-chevron-down"></span>
                    </a>
                  ) : null
                }
              </div>
            )
          }
        </section>
        {
          this.state.tiles.length > 0 ? (
            <section id="map">
              <div className="container is-marginless is-fluid map">
                <div className="columns">
                  <div className="column is-4 is-paddingless">
                    <img src={this.state.tiles[0]} alt="Top Left" />
                  </div>
                  <div className="column is-4 is-paddingless">
                    <img src={this.state.tiles[1]} alt="Top Center" />
                  </div>
                  <div className="column is-4 is-paddingless">
                    <img src={this.state.tiles[2]} alt="Top Right" />
                  </div>
                </div>
                <div  className="columns">
                  <div className="column is-4 is-paddingless">
                    <img src={this.state.tiles[3]} alt="Middle Left" />
                  </div>
                  <div className="column is-4 is-paddingless">
                    <img src={this.state.tiles[4]} alt="Center" />
                    <div className="marker">
                      <span className="lnr-map-marker"></span>
                    </div>
                  </div>
                  <div className="column is-4 is-paddingless">
                    <img src={this.state.tiles[5]} alt="Middle Right" />
                  </div>
                </div>
                <div  className="columns">
                  <div className="column is-4 is-paddingless">
                    <img src={this.state.tiles[6]} alt="Bottom Left" />
                  </div>
                  <div className="column is-4 is-paddingless">
                    <img src={this.state.tiles[7]} alt="Bottom Center" />
                  </div>
                  <div className="column is-4 is-paddingless">
                    <img src={this.state.tiles[8]} alt="Bottom Right" />
                  </div>
                </div>
              </div>
            </section>
          ) : null
        }
      </div>
    );
  };
};

export default Map;
