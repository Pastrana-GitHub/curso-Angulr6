import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestinosApiClient } from '../models/destinos-api-client.models';
import { DestinoViaje } from '../models/destino-viaje.models';

@Component({
  selector: 'app-destino-detalle',
  templateUrl: './destino-detalle.component.html',
  styleUrls: ['./destino-detalle.component.css']
})
export class DestinoDetalleComponent implements OnInit {
  destino:DestinoViaje;
  constructor(private route: ActivatedRoute, private destonoApiClient:DestinosApiClient) { }

  ngOnInit(): void {
    let id= this.route.snapshot.paramMap.get('id');
    this.destino = null;
  }
}