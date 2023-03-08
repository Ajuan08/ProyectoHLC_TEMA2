import { Component } from '@angular/core';
import { Route } from '@angular/router';
import { Musica } from '../musica';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { CallNumber } from 'capacitor-call-number';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  idMusicaSelec: string;
  musicaEditando: Musica;
  arrayColeccionMusicas: any = [{
    id: "",
    data: {} as Musica
  }];
  phoneNumber: string="620765424";
  
  constructor(private firestoreService: FirestoreService, private router: Router, private socialSharing: SocialSharing) {
    // Crear una tarea vacia al empezar
    this.musicaEditando = {} as Musica;
    this.obtenerListaMusicas();
    
  }

  obtenerListaMusicas() {
    this.firestoreService.consultar("musicas").subscribe((resultadoConsultaMusicas) => {
      this.arrayColeccionMusicas = [];
      resultadoConsultaMusicas.forEach((datosMusicas: any) => {
        this.arrayColeccionMusicas.push({
          id: datosMusicas.payload.doc.id,
          data: datosMusicas.payload.doc.data()
        })
      })
    })
  }

  clickBotonInsertar() {
      this.router.navigate(['/detalle',"nuevo"]);
  }

  selecMusica(musicaSelec) {
    this.idMusicaSelec = musicaSelec.id;
    this.musicaEditando.autor = musicaSelec.data.autor;
    this.musicaEditando.nombre_musica = musicaSelec.data.nombre_musica;
    this.musicaEditando.fecha_lanzamiento = musicaSelec.data.fecha_lanzamiento;
    this.router.navigate(['/detalle', this.idMusicaSelec]);
  }

  clickBotonEliminar() {
    this.firestoreService.borrar("musicas", this.idMusicaSelec).then(() => {
      // Actualizar la lista completa
      this.obtenerListaMusicas();
      // Limpiar musicas de pantalla
      this.musicaEditando = {} as Musica;
    })
  }
  clicBotonModificar() {
    console.log(this.idMusicaSelec);
    this.firestoreService.actualizar("musicas", this.idMusicaSelec, this.musicaEditando).then(() => {
      // Actualizar la lista completa
      this.obtenerListaMusicas();
      // Limpiar musicas de pantalla
      this.musicaEditando = {} as Musica;
    })
  }
  compartir() {
    const options = {
      message: 'Hola esto es compartir con SocialSharing',
      chooserTitle: 'Compartir con...'
    };
    
    this.socialSharing.shareWithOptions(options)
      .then(() => {
        console.log('Mensaje compartido correctamente');
      }).catch((error) => {
        console.log('Error al compartir el mensaje: ', error);
      });
  }
  async llamar() {
    await CallNumber.call({ number: this.phoneNumber, bypassAppChooser: true });
  }
  
}