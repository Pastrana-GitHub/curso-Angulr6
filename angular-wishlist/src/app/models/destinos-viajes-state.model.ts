import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DestinoViaje } from './destino-viaje.models';
import { HttpClientModule } from '@angular/common/http';

// ESTADO
export interface DestinoViajesState{
    items: DestinoViaje[];
    loading: boolean;
    favorito: DestinoViaje;
}

export function initializeDestinosViajesState(){
   return {
    items : [],
    loading : false,
    favorito : null
   };
};
// ACCIONES
export enum DestinosViajesActionTypes{
    NUEVO_DESTINO = '[Destino viajes] nuevo',
    ELEGIDO_FAVORITO = '[Destino viajes] favorito',
    VOTE_UP = '[Destino viajes] vote up',
    VOTE_DOWN = '[Destino viajes] vote Down',
    INIT_MY_DATA ='[Destinos viajes] Init My Data',
}

export class NuevoDestinoAction implements Action {
    type = DestinosViajesActionTypes.NUEVO_DESTINO;
    constructor(public destino: DestinoViaje) {}
}

export class ElegidoFavoritoAction implements Action {
    type = DestinosViajesActionTypes.ELEGIDO_FAVORITO;
    constructor(public destino: DestinoViaje) {}
}

export class VoteUpAction implements Action {
    type = DestinosViajesActionTypes.VOTE_UP;
    constructor(public destino: DestinoViaje) {}
}

export class VoteDownAction implements Action {
    type = DestinosViajesActionTypes.VOTE_DOWN;
    constructor(public destino: DestinoViaje) {}
}
export class InitMyDataAction implements Action{
    type = DestinosViajesActionTypes.INIT_MY_DATA;
    constructor(public destino: string[]) {}
}

export type DestinoViajesAction = NuevoDestinoAction | ElegidoFavoritoAction | VoteUpAction | VoteDownAction | InitMyDataAction;

// REDUCTORES

export function reducerDestinosViajes(
    state: DestinoViajesState,
    action: DestinoViajesAction
): DestinoViajesState {
    switch(action.type){
        case DestinosViajesActionTypes.INIT_MY_DATA: {
            const destinos: string[] = (action as InitMyDataAction).destino;
            return {
                ...state,
                items: destinos.map((d)=> new DestinoViaje(d,''))
            };
        }
        case DestinosViajesActionTypes.NUEVO_DESTINO: {
            return {
                ...state,
                items:[...state.items,(action as NuevoDestinoAction).destino]
            };
        }
        case DestinosViajesActionTypes.ELEGIDO_FAVORITO: {
            state.items.forEach(x => x.setSelected(false));
          
            const fav: DestinoViaje = (action as ElegidoFavoritoAction).destino;
            fav.setSelected(true);
            return {
                ...state,
                favorito:fav
            };
        }

        case DestinosViajesActionTypes.VOTE_UP: {                      
            const d: DestinoViaje = (action as VoteUpAction).destino;
            d.voteUp();
            return {...state };
        }
        case DestinosViajesActionTypes.VOTE_DOWN: {                      
            const d: DestinoViaje = (action as VoteDownAction).destino;
            d.voteDown();
            return {...state };
        }
        
    }
    return state;
}

// EFFECTS  

@Injectable()
export class DestinosViajesEffects {
    @Effect()
    nuevoAgregado$: Observable<Action> = this.action$.pipe(
        ofType(DestinosViajesActionTypes.NUEVO_DESTINO),
        map((action:NuevoDestinoAction)=> new ElegidoFavoritoAction(action.destino))
        );

        constructor(private action$:Actions){}
    }
 

