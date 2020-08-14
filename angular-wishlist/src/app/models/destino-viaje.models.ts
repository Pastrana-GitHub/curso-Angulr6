import {v4 as uuid} from 'uuid';
import { ObjectUnsubscribedError } from 'rxjs';
export class DestinoViaje{
	 selected : boolean;
	 servicios: string[];
	id = uuid();
	constructor(public nombre: string, public u:string, public votes: number = 0){
		this.servicios= ['pileta','desayuno'];
	}	
	 setSelected(s:boolean){
		 this.selected = s; 
	}
	isSelected(){
		return this.selected;
	}
	voteUp(){
		this.votes++;
	}
	voteDown(){
		this.votes--;
	}
}