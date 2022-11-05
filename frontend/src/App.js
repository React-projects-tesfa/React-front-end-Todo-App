import React from 'react';
import logo from './logo.svg';
import './App.css';


class App extends React.Component {

  constructor(props){
    super(props);
      this.state = {
        todoList: [],
        activeItem: {
          id: null,
          title: '',
          completed: false,
        },
        editing: false
      }
      this.fetchTasks = this.fetchTasks.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
      this.getCookie = this.getCookie.bind(this)
  };

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
  

  componentWillMount(){
    this.fetchTasks()
  }



  fetchTasks(){
    console.log('Fetching')
    fetch('http://127.0.0.1:8000/api/task-list/')
    .then(response => response.json())
    .then(data => 
      //console.log('Data: ', data)
      this.setState({
        todoList: data
      })
      )
  }

  handleChange(e){
    var name = e.target.name // the name of the target div/any tag
    var value = e.target.value
    console.log('Name: ', name)
    console.log('Value: ', value)

    this.setState({
      activeItem: {
        ...this.state.activeItem, // update child state
        title: value
      }
    })
  }

  handleSubmit(e){
    e.preventDefault()
    console.log('ITEM: ', this.state.activeItem)

    var csrftocken = this.getCookie('csrftocken')

    var url = 'http://127.0.0.1:8000/api/task-create/'
    fetch(url, {
      method: 'POST',
      headers:{
        'Content-type': 'application/json',
        'X-CSRFToken': csrftocken,
      },
      body: JSON.stringify(this.state.activeItem)
    }).then((response) => {
      this.fetchTasks()
      this.setState({
        activeItem: {
          id: null,
          title: '',
          completed: false,
        }
      })
    }).catch(function(error){
      console.log("EROR:", error)
    })
  }

  startEdit(task){
    this.setState({
      activeItem: task,
      editing: true,
    })
  }


  render(){
    var tasks = this.state.todoList
    var self = this
    return (
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={this.handleSubmit} id="form">
              <div style={{flex: 6}}>
                <input onChange={this.handleChange} value={this.state.activeItem.title} className="form-control" id="title" name='title' type="text" placeholder='Add task'/>
              </div>
              <div style={{flex:1}}>
                <input id="submit" className="btn btn-warning" type="submit"/>
              </div>
            </form>
 
          </div>
          <div id="list-wrapper">
            { tasks.map(function(task, index){
              return(
                <div key={index} className="task-wrapper flex-wrapper">
                  <div style={{flex:7}}>
                    <span>{task.title}</span>
                  </div>
                  <div style={{flex:1}}>
                    <button onClick={() => self.startEdit(task)} className="btn btn-sm btn-outline-info"> Edit</button>
                  </div>
                  <div style={{flex:1}}>
                    <button className="btn btn-sm btn-outline-dark delete">-</button>
                  </div>
                </div>
              )
            }

            ) }
          </div>
        </div>
      </div>
    )
  }
}


export default App;
