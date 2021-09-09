import React, { useState } from 'react';
import {Route} from 'react-router-dom';
import './App.css';
import Nav from './components/Nav.jsx';
import Cards from './components/Cards.jsx';
import About from './components/About.jsx';
import Ciudad from './components/Ciudad.jsx';
require('dotenv').config()

const apiKey = process.env.REACT_APP_API_KEY;

function App() {
  const [cities, setCities] = useState([]);
  function onClose(id) {
    setCities(oldCities => oldCities.filter(c => c.id !== id));
  }
  function onSearch(ciudad) {
    //Llamado a la API del clima
    if (cities.length > 0){
      for (let j = 0; j < cities.length; j++){
        if (cities[j].name.toLowerCase() === ciudad.toLowerCase()){
          alert ("City already available")
          return;
        }
      }
    } 
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&appid=${apiKey}`)
      .then(r => r.json())
      .then((recurso) => {
        if(recurso.main){
          const ciudad = {
            min: Math.round(recurso.main.temp_min),
            max: Math.round(recurso.main.temp_max),
            img: recurso.weather[0].icon,
            id: recurso.id,
            wind: recurso.wind.speed,
            temp: recurso.main.temp,
            name: recurso.name,
            weather: recurso.weather[0].main,
            clouds: recurso.clouds.all,
            latitud: recurso.coord.lat,
            longitud: recurso.coord.lon
          };
          setCities(oldCities => [...oldCities, ciudad]);
        } else {
          alert("City not found");
        }
      });
  }
  function onFilter(ciudadId) {
    let ciudad = cities.filter(c => c.id === parseInt(ciudadId));
    if(ciudad.length > 0) {
        return ciudad[0];
    } else {
        return null;
    }
  }
  return (
      <div className = "styles">
      <Route
        path='/'
        render={() => <Nav onSearch={onSearch} />}
      />
      <Route
        path='/about'
        component={About}
      />
      <Route
          exact path = '/'
          render ={() => <Cards cities={cities} onClose={onClose} />}
      />

      <Route
          exact
          path='/ciudad/:ciudadId'
          render={({match}) => <Ciudad
          city={onFilter(match.params.ciudadId)}
        />}
      />
      </div>
    
  );
}
export default App;

