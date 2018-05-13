import { Task } from '../ts/task';

export class DataStorage{
  status:boolean;
  changecolor:boolean;
  dataname:string;
  constructor( dataname:string ){
    //check if local storage available
    if( window.localStorage ){
    //local storage  available
      this.status = true;
      this.dataname = dataname;
    }
    else{
    //local storage not available
      this.status = false;
    }
  }
  read( callback ){
    if( this.status ){
      try{
        let data:string = window.localStorage.getItem(this.dataname);
        callback( JSON.parse( data ) );
      }
      catch( error ){
        //console.log(error)
        callback (false);
      }
    }
  }
  store( tasks:Array <Task>, callback ){
    if( this.status ){
      try{
        let data:string = JSON.stringify( tasks );
        window.localStorage.setItem(this.dataname, data );
        callback( true );
      }
      catch( error ){
        //console.log(error)
        callback( false ); 
      }
    }
  }
}
