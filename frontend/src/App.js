import React from 'react';
import logo from './logo.svg';
import './App.css';


class App extends React.Component {
  render(){
    return (
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form id="form">
              <div style={{flex: 6}}>
                <input className="form-control" id="title" type="text" placeholder='Add task'/>
              </div>
              <div style={{flex:1}}>
                <input id="submit" className="btn btn-warning" type="submit"/>
              </div>
            </form>
 
          </div>
          <div id="list-wrapper">

          </div>
        </div>
      </div>
    )
  }
}


export default App;
