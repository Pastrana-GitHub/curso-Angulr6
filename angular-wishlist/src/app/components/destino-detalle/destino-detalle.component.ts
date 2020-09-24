import { Component, OnInit, InjectionToken, inject, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestinosApiClient } from './../../models/destinos-api-client.models';
import { DestinoViaje } from './../../models/destino-viaje.models';


@Component({
  selector: 'app-destino-detalle',
  templateUrl: './destino-detalle.component.html',
  styleUrls: ['./destino-detalle.component.css'],
  providers:[DestinosApiClient]
})
export class DestinoDetalleComponent implements OnInit {
  destino:DestinoViaje;
  style = {
    sources:{
      world: {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/johan/world.geo.json/master/coutries.geo.json'
      }
    },
    version: 8,
    layers: [{
      'id' : 'countries',
      'type' : 'fill',
      'source' : 'world',
      'layout' : {},
      'paint' : {
        'fill-color' : '#6F788A',
      }     
    }]
  };
  constructor(private route: ActivatedRoute, private destinoApiClient: DestinosApiClient) { }

  ngOnInit() {
    let id= this.route.snapshot.paramMap.get('id');
    this.destino = this.destinoApiClient.getById(id);
  }
}
