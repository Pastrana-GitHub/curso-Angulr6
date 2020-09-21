import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DestinoViaje } from './.././../models/destino-viaje.models';
import { DestinosApiClient } from './.././../models/destinos-api-client.models';
import { Store, State } from '@ngrx/store';
import { AppStates } from './../../app.module';
import { ElegidoFavoritoAction, NuevoDestinoAction } from './../../models/destinos-viajes-state.model';
import { state } from '@angular/animations';

@Component({
  selector: 'app-lista-destinos',
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.css'],
  providers:[DestinosApiClient]
})
export class ListaDestinosComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  updates: string[];  
  //all;

  constructor(
    public destinoApiClient: DestinosApiClient, 
    private store: Store<AppStates>
    ) { 
    this.onItemAdded = new EventEmitter();
    this.updates=[];
  }

  ngOnInit(): void {
    this.store.select(state => state.destinos.favorito)
    .subscribe(data => {
      const f = data;
      if(f != null){
        this.updates.push('Se eligio: '+ f.nombre);
      }
    });
  }

  agregado(d:DestinoViaje){
    this.destinoApiClient.add(d);   
    this.onItemAdded.emit(d);
    }

  elegido(e: DestinoViaje){
   this.destinoApiClient.elegir(e);
   }

  getAll(){
 }
}
