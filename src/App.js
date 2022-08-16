import React from 'react';
import axios from 'axios';
import { Chart as ChartJS } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

class App extends React.Component {

  constructor(props) {
    console.log("================================================================================")
    console.log("App Constructor STARTS----------------------------------")
    super(props);
    this.apikey = '8ab2eeb364f972411c18856827ac96b5';
    this.state = {
      chartData : {
        labels: [...Array(40).keys()],
        datasets: [
          {
            id: 0,
            label: 'Label1',
            data: [69, 69, 69, 69],
          },
          {
            id: 1,
            label: 'Label2',
            data: [55, 55, 55, 55],
          },
        ],
        
      },
    };
    this.handleGraphChange = this.handleGraphChange.bind(this)
    console.log("App Constructor ENDS----------------------------------")
  }

  handleGraphChange(id, newChartData) {

    console.log("this.state.chartData: ", this.state.chartData)
    var output2 = {...this.state.chartData};
    var output = JSON.parse(JSON.stringify(this.state.chartData))
    console.log("output: ", output)
    console.log("output spread: ", output2)
    console.log("newChartData: ", newChartData);
    console.log("index operator: ", newChartData.datasets[0].data)
    
    setTimeout(() => { 
      if (id == 0) {
        output.datasets[0] = newChartData.datasets[0];
      } else if (id == 1) {
        output.datasets[1] = newChartData.datasets[0];
      }
      this.setState({
        chartData : output,
      });
      console.log("output after edit: ", output)
      console.log("this.state.chartData: ", this.state.chartData);
    }, 0);
  }

  render() {
    return (
      <div className="app">
        <div className='location1'>
          <div className='search'>
            <h2>Weather Comparison App</h2>
            <Location 
              apikey={this.apikey} 
              id={0} 
              onGraphChange={this.handleGraphChange}
              initLocation='London'
            />
            <hr></hr>
            <Location 
              apikey={this.apikey} 
              id={1}
              onGraphChange={this.handleGraphChange}
              initLocation='New York'
            />
            <hr></hr>
            <Line 
              data={this.state.chartData}
              height={250}
              width={400}
              options={{
                maintainAspectRatio: true, 
                responsive: false,
                scales: {y: {title: {display: true, text: '°C',}}}
              }}
            />
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
      id : this.props.id,
      locationName : '',
      locationTextField : '',
      country : '',
      temperatureC : '',
      temperatureF : '',
    };
    this.getCoords = this.getCoords.bind(this);
    this.getWeather = this.getWeather.bind(this);
    this.getForecast = this.getForecast.bind(this);
    this.getCoords(this.props.initLocation);
    console.log("Location Constructor ENDS----------------------------------");
  };

  getCoords(location) {
    console.log("getCoords STARTS----------------------------------");
    const geocodingURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + location + '&limit=1&appid=' + this.props.apikey;
    
    axios.get(geocodingURL).then((response) => {
      console.log("AXIOS GET GEOCODINGURL STARTS---------------");
      console.log(response.data);
      console.log("LAT LON: ", response.data[0].lat, response.data[0].lon);
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
      const tempArr = []
      for (let i = 0; i < 40; i++) {
        tempArr.push(Math.round(response.data.list[i].main.temp - 273.15));
      }
      console.log("tempArr: ", tempArr);
      var color = '';
      if (this.state.id == 0) {
        color = 'rgba(245, 179, 66, 1)';
      } else {
        color = 'rgba(66, 147, 245, 1)';
      }
      this.props.onGraphChange(
        this.state.id,
        {
          labels : [...Array(40).keys()],
          datasets : [{
            id : this.state.id,
            label : response.data.city.name + ', ' + response.data.city.country,
            data : tempArr,
            borderColor: color,
            
          }],
          
        }
      );
      console.log(this.state.chartData)
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
