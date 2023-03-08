import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Musica } from '../musica';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  id: string;
  document: any = {
    id: '',
    data: {} as Musica,
  };
  nuevo: boolean;
  handlerMessage = '';
  roleMessage = '';
  isNew: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    private router: Router,
    private loadingController: LoadingController,

    private alertController: AlertController,
    private toastController: ToastController,
    private imagePicker: ImagePicker
  ) {}

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id === 'nuevo') {
      this.isNew = true;
    } else {
      this.isNew = false;
      this.firestoreService
        .consultarPorId('musicas', this.id)
        .subscribe((resultado) => {
          // Preguntar si se hay encontrado un document con ese ID
          if (resultado.payload.data() != null) {
            this.document.id = resultado.payload.id;
            this.document.data = resultado.payload.data();
            // Como ejemplo, mostrar el título de la tarea en consola
            console.log(this.document.data.autor);
          } else {
            // No se ha encontrado un document con ese ID. Vaciar los musicas que hubiera
            this.document.data = {} as Musica;
          }
        });
    }
  }

  volver() {
    this.router.navigate(['/home']);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: '¿Deseas eliminar la musica?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'SI',
          role: 'confirm',
          handler: () => {
            this.clicBotonBorrar();
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    this.roleMessage = `Dismissed with role: ${role}`;
  }

  clicBotonBorrar() {
    this.firestoreService.borrar('musicas', this.id).then(() => {
      this.router.navigate(['/home']);
    });
  }

  clicBotonModificar() {
    if (this.isNew) {
      this.firestoreService.insertar("musicas", this.document.data).then(() => {
        this.router.navigate(['/home']);
      });
    } else {
      this.firestoreService.actualizar("musicas", this.id, this.document.data).then(() => {
        this.router.navigate(['/home']);
      });
    }
  }

  clickBotonInsertar() {
    this.firestoreService.insertar('musicas', this.document.data).then(
      () => {
        console.log('Musica creada correctamente');
        this.document.data = {} as Musica;
      },
      (error) => {
        console.log(error);
      }
    );

    this.router.navigate(['/home']);
    this.presentToast('top');
  }

  async presentToast(position: 'top') {
    const toast = await this.toastController.create({
      message: 'Musica añadida correctamente',
      duration: 1500,
    });

    await toast.present();
  }
  async uploadImagePicker() {

    const loading = await this.loadingController.create({
      message: 'Espere...'
    });

    const toast = await this.toastController.create({
      message: 'La imágen fue actualizada con éxito',
      duration: 3000
    });

    this.imagePicker.hasReadPermission().then (
      (result) => {
        if(result == false) {
          this.imagePicker.requestReadPermission();
        }
        else {
          this.imagePicker.getPictures({
            maximumImagesCount: 1,
            outputType: 1
          }).then (
            (results) => {
              let nombreCarpeta = "imagenes";
              for (var i = 0; i < results.length; i++) {
                console.log("1234");
                loading.present();
                console.log("Hola");
                let nombreImagen = `${new Date().getTime()}`;
                console.log(nombreCarpeta);
                console.log(nombreImagen);
                //console.log(results[i]);
                this.firestoreService.uploadImage(nombreCarpeta, nombreImagen, results[i])
                  .then(snapshot => {
                    snapshot.ref.getDownloadURL()
                      .then(downloadURL => {
                        console.log("downloadURL: " + downloadURL);
                        toast.present();
                        loading.dismiss();
                      })
                  })
              }
            },
            (err) => {
              console.log(err)
            }
          );
        }
      }, (err) => {
        console.log(err);
      });
  }

  async deleteFile(fileURL) {
    const toast = await this.toastController.create({
      message: 'La imágen fue borrada con éxito',
      duration: 3000
  });
  this.firestoreService.deleteFileFromURL(fileURL)
    .then(() => {
      toast.present();
    }, (err) => {
      console.log(err);
    });
  }

}