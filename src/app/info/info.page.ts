import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  map: L.Map;

  constructor() { }

  ngOnInit() {
    
  }
  ionViewDidEnter(){
    this.loadMap();
  }

  loadMap() {
    let latitud = 36.68042;
    let longitud = -6.11167;
    let zoom = 15;
    this.map = L.map("mapId").setView([latitud, longitud], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        .addTo(this.map);
    L.marker([36.68042, -6.11167]).addTo(this.map).bindPopup('Aquí').openPopup();
  }

}
