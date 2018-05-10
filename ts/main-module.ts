// import modules from other files
import * as moment from 'moment';
import { ListView } from '../ts/listview';
import { Task } from '../ts/task';
//import { Template } from '../ts/template';
import { TaskManager } from '../ts/taskmanager';
import { DataStorage } from '../ts/datastorage';

function getParentId(elm:Node){
  while( elm.parentNode ){
    elm = elm.parentNode;
    let id:string = (<HTMLElement> elm).getAttribute('id');
    if( id ){
      return id;
    }
  }
  return null;
}
//----INITIALISE CLASSES
//array to store tasks
var taskarray: Array<Task> = [];
//storage class
var taskstorage = new DataStorage('taskdata');
//Task Manager class, pass the task array
var taskmanager = new TaskManager( taskarray );
//list view
var listview = new ListView('task-list');
//task template
//export var tasktemplate = new Template();


//things to do when app loads
window.addEventListener('load',init);
function init(){
  //read tasks from storage and display
  taskstorage.read( (data) => {
    if( data.length > 0 ){
      data.forEach( (item) => {
        taskarray.push( item );
      });
      listview.clear();
      listview.render( taskarray );
    }
  });
}
//reference to form
const taskform:HTMLFormElement = (<HTMLFormElement>document.getElementById('task-form'));
//add listener to form
taskform.addEventListener('submit', ( event: Event) => {
  event.preventDefault();
  let input:HTMLElement = document.getElementById('task-input');
  let taskname: string = (<HTMLInputElement>input).value;
  //prevent blank tasks form being created
  if( taskname.length > 0 ){
    let task:Task = new Task(taskname);
    taskmanager.add( task);
    taskstorage.store( taskarray, ( result ) => {
      if( result ){
        taskform.reset();
        listview.clear();
        listview.render( taskarray );
      }
      else{
        //show error message / call error handler
      }
    });
  }
});

//--LIST STUFF
//add listener to list
const listelement:HTMLElement = document.getElementById('task-list');
//add listener to list
listelement.addEventListener('click', (event:Event) => {
  let target:HTMLElement = <HTMLElement> event.target;
  let id = getParentId( (<Node> event.target) );

  if( target.getAttribute('data-function') == 'status' ){
    if( id ){
      taskmanager.changeStatus(id,() => {
        taskstorage.store( taskarray , () => {
          listview.clear();
          listview.render( taskarray );
        });
      });
    }
  }
  if( target.getAttribute('data-function') == 'delete'){
    if( id ){
      taskmanager.remove( id, () => {
        taskstorage.store( taskarray, () => {
          listview.clear();
          listview.render( taskarray );
        });
      });
    }
  }
});
