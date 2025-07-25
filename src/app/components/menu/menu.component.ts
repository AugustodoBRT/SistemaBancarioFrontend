import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/User';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { AccountService } from '../../services/account/account.service';
import { Account } from '../../models/Account';

@Component({
  selector: 'app-menu',
  imports: [MatIconModule, NavBarComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  user!: User;
  saldo: number = 0;

  constructor(private router: Router, private accountService: AccountService, private authenticationService: AuthenticationService ){}
  
  ngOnInit() {
    this.accountService.getUserAccounts().subscribe({
      next:(accounts: Account[]) => {
        accounts.forEach(account => this.saldo += Number(account.saldo))
      }
    })
  }

  goToAccount(){
    this.router.navigate(['/conta'])
  }

  goToWithdrawal(){
    this.router.navigate(['/saque'])
  }

  goToDeposit(){
    this.router.navigate(['/deposito'])
  }

  goToBankStatement(){
    this.router.navigate(['/extrato'])
  }

  goToTransference() {
    this.router.navigate(['/transferencia'])
  }

  goToAccess() {
    this.router.navigate(['/acessos'])
  }

  goToPix() {
    this.router.navigate(['/pix']);
  }

  logout(){
    this.authenticationService.logoutUser();
  }
}
