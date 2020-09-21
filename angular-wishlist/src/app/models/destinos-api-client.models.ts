import { DestinoViaje } from './destino-viaje.models';
import { Subject, BehaviorSubject } from 'rxjs';
import { AppStates, APP_CONFIG, AppConfig, db } from '../app.module';
import { Store } from '@ngrx/store';
import { NuevoDestinoAction, ElegidoFavoritoAction } from './destinos-viajes-state.model';
import { Injectable, Inject, forwardRef } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable()
export class DestinosApiClient{
	destinos: DestinoViaje[] = [];

	constructor(
		private store:Store<AppStates>,
		@Inject(forwardRef(()=> APP_CONFIG)) private config: AppConfig,
		private http: HttpClient
		){
		this.store
		.select(state => state.destinos)
		.subscribe((data) => {
			console.log('destinos sub store');
			console.log(data);
			this.destinos = data.items;
		});
		this.store
		.subscribe((data)  => {
			console.log('all store');
			console.log(data);
		});
	}
	add(d:DestinoViaje){
		const headers: HttpHeaders = new HttpHeaders({'X-API-TOKEN': 'token-seguridad'});
		const req = new HttpRequest('POST', this.config.apiEndpoint + '/my', {nuevo: d.nombre}, {headers: headers});
		this.http.request(req).subscribe((data: HttpResponse<{}>)=> {
			if(data.status === 200){
				this.store.dispatch(new NuevoDestinoAction(d));
				const myDb = db;
				myDb.destinos.add(d);
				console.log('Todos los destinos de la BD !');
				myDb.destinos.toArray().then(destinos  => console.log(destinos))
			}
		});		
	}
	getAll():DestinoViaje[]{
		return this.destinos;
	}
	/*getById(id:string):DestinoViaje{
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
	getById(id:String): DestinoViaje {
		return this.destinos.filter(function(d) {return d.id.toString() === id;})[0];
	}
}