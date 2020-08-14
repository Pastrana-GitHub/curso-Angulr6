import { DestinoViaje } from './destino-viaje.models';
import { Subject, BehaviorSubject } from 'rxjs';
import { AppStates } from '../app.module';
import { Store } from '@ngrx/store';
import { NuevoDestinoAction, ElegidoFavoritoAction } from './destinos-viajes-state.model';
import { Injectable } from '@angular/core';

@Injectable()
export class DestinosApiClient{
	//destinos:DestinoViaje[];
	//current:Subject<DestinoViaje> = new BehaviorSubject<DestinoViaje> (null);
	constructor(private store:Store<AppStates>){
		//this.destinos =[];
	}
	add(d:DestinoViaje){
		//this.destinos.push(d);
		this.store.dispatch(new NuevoDestinoAction(d));

	}
	/*getAll():DestinoViaje[]{
		return this.destinos;
	}
	getById(id:string):DestinoViaje{
		return this.destinos.filter(function(d){ return d.id.toString()== id;})[0];
	}
	subscribeOnChange(fn){
		this.current.subscribe(fn);
	}
	*/
	elegir(d:DestinoViaje){
		//this.destinos.forEach(x=>x.setSelected(false));
		//d.setSelected(true);
		//this.current.next(d);
		this.store.dispatch(new ElegidoFavoritoAction(d));
	}	
}