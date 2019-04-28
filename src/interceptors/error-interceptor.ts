import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'; // IMPORTANTE: IMPORT ATUALIZADO

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

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

            return Observable.throw(errorObj);
        }) as any;
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};