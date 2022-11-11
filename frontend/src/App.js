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
      this.startEdit = this.startEdit.bind(this)
      this.deleteItem = this.deleteItem.bind(this)
      this.strikeUnstrike = this.strikeUnstrike.bind(this)
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

    if(this.state.editing == true){
      url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}`

      this.setState({
        editing: false
      })
    }
    //console.log(this.state.activeItem)

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

  strikeUnstrike(task){
    task.completed = !task.completed
    console.log("Task: ", task.completed)

    var csrftocken = this.getCookie('csrftocken')
    var url=`http://127.0.0.1:8000/api/task-update/${task.id}`

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftocken,
      },
      body: JSON.stringify({'completed': task.completed, 'title' : task.title})
    }).then(() => {
      this.fetchTasks()
    })
  }

  deleteItem(task){
    var csrftocken = this.getCookie('csrftocken')

    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}`, {
      method: 'DELETE',
      headers : {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftocken,
      }
    }).then((response) => {
      this.fetchTasks()
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
                  <div onClick={() => self.strikeUnstrike(task)} style={{flex:7}}>
                    {task.completed == false ? (
                      <span>{task.title}</span>
                      ) : (
                      <strike>{task.title}</strike>
                      )}
                    
                  </div>
                  <div style={{flex:1}}>
                    <button onClick={() => self.startEdit(task)} className="btn btn-sm btn-outline-info"> Edit</button>
                  </div>
                  <div onClick={() => self.deleteItem(task)} style={{flex:1}}>
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
