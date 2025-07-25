import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, EMPTY, Observable, throwError } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { ConfirmService } from "../services/confirm/confirm.service";
import { UserService } from "../services/user/user.service";
import { AuthenticationService } from "../services/authentication/authentication.service";

@Injectable({
    providedIn: "root",
})
export class AuthorizationInterceptor implements HttpInterceptor {
    constructor(private cookieService: CookieService, private authenticationService: AuthenticationService, private confirmService: ConfirmService, private userService: UserService, private router: Router
    ) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        if (req.url.includes("/users/login") || req.url.includes("/users/register")) {
            return next.handle(req);
        }

        const token = this.cookieService.get("token");

        let modifiedReq = req.clone({
            setHeaders: token ? { Authorization: `Bearer ${token}` } : {}
        });

        return next.handle(modifiedReq).pipe(
            catchError((error: HttpErrorResponse) => {
                
                if (error.status === 401 || error.status === 403) {

                    const isUserLoggedIn: boolean = this.userService.isUserLoggedIn();
                    
                    if (isUserLoggedIn){
                        
                        this.authenticationService.logoutUserSessionExpired();


                        return EMPTY; // evita que o erro do componente sobreponha o erro de sessao
                    }


                }
                return throwError(() => error);
            }));
    }
}