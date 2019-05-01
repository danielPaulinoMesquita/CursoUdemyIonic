import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'; // IMPORTANTE: IMPORT ATUALIZADO
import { StorageService } from '../services/storage.service';
import { AlertController } from 'ionic-angular';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

constructor(public storage: StorageService, public alertCtrl: AlertController){

}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("Passou no interceptor");
        return next.handle(req)

        // variável error dentro do catch significa a excessão na hora da requisição
        // essa variável tem o campo error que vem da API backend
        .catch((error, caught) => {
            let errorObj = error; //Atribuindo o error original para uma nova variavel
            if (errorObj.error) {
                errorObj = errorObj.error; //Extraindo campo error do error original
            }
            if (!errorObj.status) {
                errorObj = JSON.parse(errorObj);
            }

            console.log("Erro detectado pelo interceptor:");
            console.log(errorObj);

            switch(errorObj.status){
                case 401:
                this.handle401();
                
                break;
                case 403:
                this.handle403();
                
                break;
                default:
                this.handleErrorDefault(errorObj);
            }

            return Observable.throw(errorObj);
        }) as any;
    }
    handle401(){
       let alert= this.alertCtrl.create({
           title:'Erro 401: falha de autenticação',
           message:'Email e senha incorretos',
           enableBackdropDismiss:false,
           buttons:[
               {
                    text:'OK'
               }
        ]
       });
       alert.present();
    }

    handle403(){
        this.storage.setLocalUser(null);
    }

    handleErrorDefault(errorObj){
        let alert= this.alertCtrl.create({
            title:'Erro: '+errorObj.status+': '+errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss:false,
            buttons:[
                {
                     text:'OK'
                }
         ]
        });
        alert.present();
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};