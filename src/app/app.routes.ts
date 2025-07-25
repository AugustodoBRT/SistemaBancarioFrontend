import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { ContasComponent } from './components/contas/contas.component';
import { SaqueComponent } from './components/saque/saque.component';
import { DepositoComponent } from './components/deposito/deposito.component';
import { ExtratoComponent } from './components/extrato/extrato.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { TransferenciaComponent } from './components/transferencia/transferencia.component';
import { AcessosComponent } from './components/acessos/acessos.component';
import { PixComponent } from './components/pix/pix.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {path: 'login', component: LoginComponent},
    {path: 'menu',component: MenuComponent},
    {path: 'conta',component: ContasComponent},
    {path: 'saque',component: SaqueComponent},
    {path: 'deposito',component: DepositoComponent},
    {path: 'extrato',component: ExtratoComponent},
    {path: 'cliente',component: ClienteComponent},
    {path: 'transferencia',component: TransferenciaComponent},
    {path: 'acessos',component: AcessosComponent},
    {path: 'pix',component: PixComponent},
];
