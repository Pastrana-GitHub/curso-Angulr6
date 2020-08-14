import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DestinoViaje } from './../models/destino-viaje.models';
import { DestinosApiClient } from './../models/destinos-api-client.models';
import { Store, State } from '@ngrx/store';
import { AppStates } from '../app.module';
import { ElegidoFavoritoAction, NuevoDestinoAction } from '../models/destinos-viajes-state.model';

@Component({
  selector: 'app-lista-destinos',
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.css']
})
export class ListaDestinosComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  //destinos:DestinoViaje[];
  updates: string[];  
  all;

  constructor(public destinoApiClient: DestinosApiClient, private store: Store<AppStates>) { 
    this.onItemAdded = new EventEmitter();
    //this.destinos =[];
    this.updates = [];
    this.store.select(state=>state.destinos.favorito)
    .subscribe(d=> {      
      if(d != null){
        this.updates.push('Se ha elegido a '+ d.nombre);
      }
    });
   // this.destinoApiClient.subscribeOnChange((d: DestinoViaje) => {
    //  if(d!=null){
    //    this.updates.push('Se ha elegido a '+ d.nombre);
    //  }
   // })
   store.select(State => State.destinos.items).subscribe(items => this.all = items);
  }

  ngOnInit(): void {
  }
  /*guardar(nombre:string, url:string):boolean{
  this.destinos.push(new DestinoViaje(nombre, url));
  console.log(this.destinos);
  console.log(url);
  	return false;
  }*/

  agregado(d:DestinoViaje){
    this.destinoApiClient.add(d);   
    this.onItemAdded.emit(d);
    //this.store.dispatch(new NuevoDestinoAction(d));
    }

  elegido(e: DestinoViaje){
   //this.destinos.forEach(function (x){x.setSelected(false);});
   //d.setSelected(true);
   //this.destinoApiClient.getAll().forEach(element => {element.setSelected(false) })
   this.destinoApiClient.elegir(e);
   //e.setSelected(true);
   //this.store.dispatch(new ElegidoFavoritoAction(e));
  }

  getAll(){

  }


}
