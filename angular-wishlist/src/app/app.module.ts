import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken, Injectable, APP_INITIALIZER } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule as NgRxStoreModule, ActionReducerMap, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientModule, HttpHeaders, HttpRequest, HttpClient } from '@angular/common/http';
import { Dexie } from 'dexie';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { DestinoViajeComponent } from './components/destino-viaje/destino-viaje.component';
import { ListaDestinosComponent } from './components/lista-destinos/lista-destinos.component';
import { DestinoDetalleComponent } from './components/destino-detalle/destino-detalle.component';
import { FormDestinoViajeComponent } from './components/form-destino-viaje/form-destino-viaje.component';
import { DestinosApiClient } from './models/destinos-api-client.models';
import { DestinoViajesState, reducerDestinosViajes, initializeDestinosViajesState, DestinosViajesEffects, InitMyDataAction } from './models/destinos-viajes-state.model';
import { flatMap, reduce } from 'rxjs/operators';
import { LoginComponent } from './components/login/login/login.component';
import { ProtectedComponent } from './components/protected/protected/protected.component';
import { AuthService } from './services/auth.service';
import { UsuarioLogueadoGuard } from './guards/usuario-logueado/usuario-logueado.guard';
import { VuelosComponentComponent } from './components/vuelos/vuelos-component/vuelos-component.component';
import { VuelosMainComponentComponent } from './components/vuelos/vuelos-main-component/vuelos-main-component.component';
import { VuelosMasInfoComponentComponent } from './components/vuelos/vuelos-mas-info-component/vuelos-mas-info-component.component';
import { VuelosDetalleComponentComponent } from './components/vuelos/vuelos-detalle-component/vuelos-detalle-component.component';
import { ReservasModule } from './reservas/reservas.module';
import { createInjectionToken } from '@angular/compiler/src/core';
import { async } from 'rxjs/internal/scheduler/async';
import { DestinoViaje } from './models/destino-viaje.models';
import { from, Observable } from 'rxjs';

//app config
export interface AppConfig {
  apiEndpoint: String;
}
const APP_CONFIG_VALUE: AppConfig = {
  apiEndpoint: 'http://localhost:3000'
};
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
// fin app config

export const childrenRoutesVuelos: Routes= [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: VuelosMainComponentComponent},
  { path: 'mas-info', component: VuelosMasInfoComponentComponent},
  { path: ':id', component: VuelosDetalleComponentComponent},
];
const routes: Routes =[
  {path:'', redirectTo:'home', pathMatch:'full'},
  {path:'home', component: ListaDestinosComponent},
  {path:'destino/:id', component: DestinoDetalleComponent},
  {path: 'login', component: LoginComponent},
  {
    path:'protected',
    component: ProtectedComponent,
    canActivate: [ UsuarioLogueadoGuard ]
  },
  {
    path: 'vuelos',
    component: VuelosComponentComponent,
    canActivate: [ UsuarioLogueadoGuard ],
    children: childrenRoutesVuelos
  }

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

// fin redux init

//app init
export function init_app(appLoadService: AppLoadService): () => Promise<any> {
  return () => appLoadService.initializeDestinosViajesState();
}
@Injectable()
class AppLoadService {
  constructor(private store: Store<AppStates>, private http: HttpClient) { }
    async initializeDestinosViajesState(): Promise<any> {
      const headers: HttpHeaders = new HttpHeaders({'X-API-TOKEN': 'token-seguridad'});
      const req = new HttpRequest('GET', APP_CONFIG_VALUE.apiEndpoint + '/my', { headers: Headers });
      const response: any = await this.http.request(req).toPromise();
      this.store.dispatch(new InitMyDataAction(response.body));
   }
}
// fin app init

// dexie db
export class Translation {
  constructor(public id: number, public lang: string, public key: string, public value: string){}
}
@Injectable({
  providedIn: 'root'
})
export class MyDatabase extends Dexie {
  destinos: Dexie.Table<DestinoViaje, number>;
  translations: Dexie.Table<DestinoViaje, number>;
  constructor(){
    super('MyDatabase');
    this.version(1).stores({
      destinos: '++id, nombre, imagenUrl'
    });
    this.version(2).stores({
      destinos: '++id, lang, key, value',
      translations: '++id, lang, key, value'
    });
  }
}
export const db = new MyDatabase();
// fin dexie db

// i18n ini
class TranslationLoader implements TranslationLoader {
  constructor(private http: HttpClient){  }

  getTranslation(lang: string): Observable<any> {
    const promise = db.translations
    .where('lang')
    .equals(lang)
    .toArray()
    .then(results => {
      if(results.length === 0){
        return this.http
        .get<Translation[]>(APP_CONFIG_VALUE.apiEndpoint + '/api/translation?lang' + lang)
        .toPromise()
        .then(apiResults => {
          db.translations.bulkAdd(apiResults);
          return apiResults;
        });
      }
      return results;
    }).then((traducciones) => {
      console.log('traducciones cargadas: ');
      console.log(traducciones);
      return traducciones;
    }).then((traducciones)=>{
      return traducciones.map((t) => ({ [t.key]: t.value }));
    });
    return from(promise).pipe(flatMap((elems) =>  from(elems)));
  }
}

function HttpLoadeFactory(http: HttpClient){
  return new TranslationLoader(http);
}
// fin i18n ini
@NgModule({
  declarations: [
    AppComponent,
    DestinoViajeComponent,
    ListaDestinosComponent,
    DestinoDetalleComponent,
    FormDestinoViajeComponent,
    LoginComponent,
    ProtectedComponent,
    VuelosComponentComponent,
    VuelosMainComponentComponent,
    VuelosMasInfoComponentComponent,
    VuelosDetalleComponentComponent    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    NgRxStoreModule.forRoot(reducers, {initialState: reducersInitialState}),
    EffectsModule.forRoot([DestinosViajesEffects]),
    StoreDevtoolsModule.instrument(),
    ReservasModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoadeFactory),
        deps:[HttpClient]
      }
    })
  ],
  providers: [      
    AuthService, UsuarioLogueadoGuard,
    { provide: APP_CONFIG, useValue: APP_CONFIG_VALUE },
    AppLoadService,
    {provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi:true}
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
