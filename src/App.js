import React, { Component } from 'react';
import './App.css';

require('dotenv').config();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isloaded: false,
      search: '',
      query: '',
    }
  }


  componentDidMount() {
    this.performSearch();
  }

  performSearch = () => {
    
    fetch(`https://api.edamam.com/search?q=${this.state.query}&app_id=${process.env.REACT_APP_API_ID}&app_key=${process.env.REACT_APP_API_KEY}`)
      .then(res => res.json())
      .then(json => {
        this.setState({
          isloaded: true,
          items: json,
        })
      });
  }

  componentDidUpdate(prevP, prevS, SS) {
    if(this.state.query !== prevS.query) {
      this.setState({query: this.state.query});
      this.performSearch(this.state.query);
    }
  }


  render() {
    var {isloaded, items} = this.state;
    
    if(!isloaded) {
      return (
        <div className="loading" >
          <i className="fas fa-spinner fa-5x"></i>
          <h2>Loading...</h2>
        </div>
      )
    }
    else {

      const updateSearch = e => { //passes the input target value into the search state
        this.setState({search: e.target.value});
      }

      const getSearch = e => {
        e.preventDefault();
        this.setState({query: this.state.search});
      }

      return (
        <div className="App">
          <h1>Recipes</h1>
          <form onSubmit={getSearch} className="search-form">
            <input className="search-bar" type="text" value={this.state.search} onChange={updateSearch} placeholder="Search for recipes..." autoFocus/>
            <button className="search-button" type="submit">Search</button>
          </form>
          <div className="recipes">
            {items.hits.map(item => (
              <>
              {console.log(item.recipe)
              }
                <div className="recipe-box">
                  <div>
                    <h2>{item.recipe.label}</h2>
                    <img src={item.recipe.image} alt="" className="recipe-image"></img>
                  </div>
                  <div>
                    <p>{item.recipe.dietLabels[0]}</p>
                    <p>Calories: {item.recipe.calories.toFixed(0)}</p>
                    <h4 className="ingredients">Ingredients:</h4>
                    <ul className="ingredients">{item.recipe.ingredientLines.map(ingredient => (
                      <li>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                    <p>Cook time: {item.recipe.totalTime} minutes</p>
                  <br/>
                </div>
              </>
            ))}
          </div>

        </div>
      );
    }

    
  }
  
}

export default App;
