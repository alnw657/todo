class Task{
  id: number;
  name: string;
  status: boolean;
  constructor(taskname: string){
    this.id = new Date().getTime();
    this.name = taskname;
    this.status = false;
  }  
}

//reference to form
const taskform = document.getElementById('task-form');
taskform.addEventListener('submit',( event: Event) => {
  event.preventDefault();
const input = document.getElementById('task-input');
  let taskname = (<HTMLInputElement>input).value;
  console.log(taskname);
});