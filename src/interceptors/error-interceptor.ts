import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'; // IMPORTANTE: IMPORT ATUALIZADO
import { StorageService } from '../services/storage.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

constructor(public storage: StorageService){

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
                case 403:
                this.handle403();
                break;
            }

            return Observable.throw(errorObj);
        }) as any;
    }

    handle403(){
        this.storage.setLocalUser(null);
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};