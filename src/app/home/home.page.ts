import { Component } from '@angular/core';
import { Musica } from '../musica';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tareaEditando: Musica;
  arrayColeccionMusicas: any = [{
    id: "",
    data: {} as Musica
  }];
  constructor(private firestoreService: FirestoreService) {
    // Crear una tarea vacia al empezar
    this.tareaEditando = {} as Musica;

    this.obtenerListaTareas();
  }

  clickBotonInsertar(){
    this.firestoreService.insertar("datos",this.tareaEditando)
    .then(()=>{
      console.log("Musica creada correctamente");
      this.tareaEditando = {} as Musica;
    },(error) =>{
      console.error(error)
    });
  }

  obtenerListaTareas(){
    this.firestoreService.consultar("datos").subscribe((resultadoConsultaTareas) => {
      this.arrayColeccionMusicas = [];
      resultadoConsultaTareas.forEach((datosTareas: any) => {
        this.arrayColeccionMusicas.push({
          id: datosTareas.payload.doc.id,
          data: datosTareas.payload.doc.data()
        })
      })
    }
    )
  }
}
