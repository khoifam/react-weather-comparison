import React from 'react';
import axios from 'axios';

class App extends React.Component {

  constructor(props) {
    console.log("App Constructor STARTS----------------------------------")
    super(props);
    this.apikey = '8ab2eeb364f972411c18856827ac96b5';
    this.state = {
      
    };
    console.log("App Constructor ENDS----------------------------------")
  }

  render() {
    return (
      <div className="app">
        <div className='location1'>
          <div className='search'>
            <Location apikey={this.apikey} />
            <br></br><hr></hr><br></br>
            {/* <Location apikey={this.apikey} /> */}
          </div>
        </div>
      </div>
    );
  }
}

class Location extends React.Component {

  constructor(props) {
    console.log("Location Constructor STARTS----------------------------------");
    super(props);
    this.state = {
      locationName : 'London',
      locationTextField : 'London',
      country : 'GB',
      temperatureC : '',
      temperatureF : '',
    };
    this.getCoords("London")
    console.log("Location Constructor ENDS----------------------------------");
  };

  getCoords(location) {
    console.log("getCoords STARTS----------------------------------");
    const geocodingURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + location + '&limit=1&appid=' + this.props.apikey;
    
    axios.get(geocodingURL).then((response) => {
      console.log("AXIOS GET GEOCODINGURL STARTS---------------");
      console.log(response.data);
      console.log(response.data[0].lat, response.data[0].lon);
      console.log("AXIOS GET GEOCODINGURL ENDS---------------");

      this.getWeather(response.data[0].lat, response.data[0].lon);
      this.getForecast(response.data[0].lat, response.data[0].lon);
    });  

    console.log("getCoords ENDS----------------------------------");
  };

  getWeather(lat, lon) {
    const currentURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon +  '&appid=' + this.props.apikey// + '&mode=xml';
    console.log("URL with Coords: " + currentURL);
    axios.get(currentURL).then((response) => {
      console.log("getWeather STARTS---------------");
      console.log(response.data);
      console.log(response.data.name)
      console.log(response.data.main.temp - 273.15);
      this.setState({
        locationName : response.data.name,
        country : response.data.sys.country,
        temperatureC : Math.round(response.data.main.temp - 273.15),
        temperatureF : Math.round((response.data.main.temp - 273.15) * 9 / 5 + 32),
      });
    });
  }

  getForecast(lat, lon) {
    const forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + this.props.apikey;
    console.log("URL with Coords: " + forecastURL);
    axios.get(forecastURL).then((response) => {
      console.log("getForecast STARTS---------------");
      console.log(response.data);
      for (let i = 0; i < 5; i++) {
        console.log("MIN MAX:", response.data.list[i*8].main.temp_min - 273.15, response.data.list[i*8].main.temp_max - 273.15)
      }
    });
  }

  handleForm = (event) => {
    event.preventDefault()
    this.setState({
       locationTextField : event.target.value
    })
    console.log("handleForm executed------")
  }

  handleAction = (event) => {
    event.preventDefault()
    this.getCoords(this.state.locationTextField)
    console.log("handleAction executed------")
  }

  render() {
    return(
      <div className='location'>
        <p>Enter the location:</p>
        <form onSubmit={this.handleAction}>
          <input type='text' value={this.state.locationTextField} 
          onChange={this.handleForm}/>
          <input type='submit'></input>
        </form>
        <p>{this.state.locationName}, {this.state.country}</p>
        <p>{this.state.temperatureC} °C</p>
        <p>{this.state.temperatureF} °F</p>
        {console.log("rendered")}
      </div>
    );
  };
}

export default App;
