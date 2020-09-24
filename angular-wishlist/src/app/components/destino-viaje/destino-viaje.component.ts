import { Component, OnInit, Input, HostBinding, EventEmitter, Output } from '@angular/core';
import { DestinoViaje } from './.././../models/destino-viaje.models';
import { AppStates } from './../../app.module';
import { Store } from '@ngrx/store';
import { VoteUpAction, VoteDownAction } from './../../models/destinos-viajes-state.model';
import { trigger, state, style, transition, animate } from '@angular/animations'

@Component({
  selector: 'app-destino-viaje',
  templateUrl: './destino-viaje.component.html',
  styleUrls: ['./destino-viaje.component.css'],
  animations: [
    trigger('esFavorito', [
      state('estadoFavorito', style({
        backgroundColor: 'PaleTurquoise'
      })),
      state('estadoFavorito', style({
        backgroundColor: 'WhiteSmoke'
      })),
      transition('estadoFavorito => estadoFavorito', [
        animate('3s')
      ]),
      transition('estadoFavorito => estadoFavorito', [
        animate('1s')
      ]),    
    ])
  ]
})
export class DestinoViajeComponent implements OnInit {

  @Input() destino: DestinoViaje;  
  @HostBinding('attr.class') cssClass = 'col-md-4';
  @Output() clicked: EventEmitter<DestinoViaje>;
  @Input('idx') position: number;
  constructor(private store: Store<AppStates>) { 
    this.clicked = new EventEmitter();	
  	}

  ngOnInit(): void {
  }
  ir(){
    this.clicked.emit(this.destino);
    return false;
  }
  voteUp(){
    this.store.dispatch(new VoteUpAction(this.destino));
    return false;
  }

  voteDown(){
    this.store.dispatch(new VoteDownAction(this.destino));
    return false;
  }

}
