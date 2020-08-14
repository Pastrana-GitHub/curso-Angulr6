import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule as NgRxStoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { DestinoViajeComponent } from './destino-viaje/destino-viaje.component';
import { ListaDestinosComponent } from './lista-destinos/lista-destinos.component';
import { DestinoDetalleComponent } from './destino-detalle/destino-detalle.component';
import { FormDestinoViajeComponent } from './form-destino-viaje/form-destino-viaje.component';
import { DestinosApiClient } from './models/destinos-api-client.models';
import { DestinoViajesState, reducerDestinosViajes, initializeDestinosViajesState, DestinosViajesEffects } from './models/destinos-viajes-state.model';
import { reduce } from 'rxjs/operators';

const routes: Routes =[
  {path:'', redirectTo:'home', pathMatch:'full'},
  {path:'home', component: ListaDestinosComponent},
  {path:'destino', component: DestinoDetalleComponent}
]
// redux init
export interface AppStates{
  destinos:DestinoViajesState;
}

const reducers: ActionReducerMap<AppStates> = {
  destinos: reducerDestinosViajes
}

let reducersInitialState = {
  destinos: initializeDestinosViajesState()
}

@NgModule({
  declarations: [
    AppComponent,
    DestinoViajeComponent,
    ListaDestinosComponent,
    DestinoDetalleComponent,
    FormDestinoViajeComponent    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    NgRxStoreModule.forRoot(reducers, {initialState: reducersInitialState}),
    EffectsModule.forRoot([DestinosViajesEffects]),
    StoreDevtoolsModule.instrument()
  ],
  providers: [  
    DestinosApiClient
    ],
  bootstrap: [
    AppComponent]
})
export class AppModule { }
