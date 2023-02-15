import { Injectable } from '@angular/core';
import { Musica } from './musica';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private angularFirestore: AngularFirestore,
      private angularFireStorage: AngularFireStorage) {}

  public insertar(coleccion: string, musicas: Musica) {
    return this.angularFirestore.collection(coleccion).add(musicas);
  }
  /**
   * name
   */
  public consultar(coleccion: string) {
    return this.angularFirestore.collection(coleccion).snapshotChanges();
  }

  public borrar(coleccion, documentId) {
    return this.angularFirestore.collection(coleccion).doc(documentId).delete();
  }

  public actualizar(coleccion, documentId, musicas) {
    return this.angularFirestore
      .collection(coleccion)
      .doc(documentId)
      .set(musicas);
  }

  public consultarPorId(coleccion, documentId) {
    return this.angularFirestore
      .collection(coleccion)
      .doc(documentId)
      .snapshotChanges();
  }

  public uploadImage(nombreCarpeta,nombreArchivo, imagenBase64){
    let storageRef= 
    this.angularFireStorage.ref(nombreCarpeta).child(nombreArchivo)
    return storageRef.putString("data:iamge/jpeg;base64,"+imagenBase64,'data_rul');

  }

  public deleteFileFromURL(fileURL) {

    return this.angularFireStorage.storage.refFromURL(fileURL).delete();

  }

}
