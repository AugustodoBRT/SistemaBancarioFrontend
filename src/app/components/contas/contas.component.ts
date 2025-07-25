import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import {MatTableModule} from '@angular/material/table';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account/account.service';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { BehaviorSubject } from 'rxjs';
import { Account } from '../../models/Account';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AccountLimit } from '../../models/AccountLimit';
import { ChavePix } from '../../models/ChavePix';

@Component({
  selector: 'app-contas',
  imports: [NavBarComponent, MatTableModule,NavBarComponent, MatInputModule, MatSelectModule, MatFormFieldModule, MatButtonModule, ReactiveFormsModule, 
    CommonModule, FormsModule,MatIconModule],
  templateUrl: './contas.component.html',
  styleUrl: './contas.component.scss'
})


export class ContasComponent implements OnInit{

  
  displayedColumns: string[] = ['numeroConta','saldo','limiteCredito'];
  dataSource: any;
  accounts$: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);
  selectedAccount: string = "";
  selectedAccountPix: string = "";
  valor = new FormControl('');
  chavePix = new FormControl('');
  displayPrice: string = "";

  constructor(private accountService: AccountService, private confirmService: ConfirmService, private router: Router) {}

  ngOnInit(): void {
      this.accountService.getUserAccounts().subscribe({
        next:(accounts) => {
          this.accounts$.next(accounts);
          
          this.dataSource = this.accounts$;

          if (accounts.length == 0){
            this.confirmService.warningAutoClose("Nenhuma conta encontrada","");
          }
        },
        error: (error) => {
          if (error.error && error.error.message) {
            this.confirmService.error(error.error.message,error.error.subMessage ?? "");
            return;
          }
          this.confirmService.error("Erro ao recuperar contas do usuário","");
        }
      })
  }

  createAccount() {
    this.accountService.createAccount().subscribe({
      next:(createdAccount: Account) => {

        const accounts = this.accounts$.getValue();

        accounts.push(createdAccount);

        this.accounts$.next(accounts);
        
        this.confirmService.successAutoClose("Nova conta criada com sucesso!","");

      },
      error:(error) => {
        if (error.error && error.error.message) {
          this.confirmService.error(error.error.message,error.error.subMessage ?? "");
          return;
        }
        this.confirmService.error("Erro ao criar uma nova conta.","");
      }
    });
  }

  goBack() {
    this.router.navigate(['/menu']);
  }

  onSelectClick() {
    if (this.accounts$.getValue().length == 0){
      this.confirmService.warningAutoClose("Nenhuma conta encontrada","É possível criar uma conta na seção 'Contas'");
    }
  }

  onClick() {
    if (!this.selectedAccount || !this.valor.value) {
          this.confirmService.errorAutoClose("Informações inválidas","Tanto a conta quanto o valor do novo limite devem estar preenchidos");
          return;
        }

        const selectedAccount: Account = this.accounts$.getValue().filter(account => account.numero == this.selectedAccount)[0];

        if (this.valor.value <= selectedAccount.limiteCredito) {
          this.confirmService.errorAutoClose("Informações inválidas","Não é possível alterar o limite para um valor menor ou igual do que o atual");
          return;
        }
    
        const newLimit: AccountLimit = {
          numeroConta: this.selectedAccount,
          valor: this.valor.value
        }
    
        this.accountService.newAccountLimit(newLimit).subscribe({
          next:() => {
            this.confirmService.successAutoClose("Limite alterado com sucesso!","");
            this.valor.reset('');
            this.selectedAccount = "";
            selectedAccount.limiteCredito = newLimit.valor;
          },
          error:(error) => {
            if (error.error && error.error.message) {
              this.confirmService.error(error.error.message,error.error.subMessage ?? "");
              return;
            }
            this.confirmService.error("Erro ao alterar limite","");
          }
        })
  }

  onClickPix() {
    if (!this.selectedAccountPix || !this.chavePix.value) {
          this.confirmService.errorAutoClose("Informações inválidas","Tanto a conta quanto o valor do novo limite devem estar preenchidos");
          return;
        }

        const selectedAccount: Account = this.accounts$.getValue().filter(account => account.numero == this.selectedAccount)[0];
    
        const chavePix: ChavePix = {
          numeroConta: this.selectedAccountPix,
          chavePix: this.chavePix.value
        }
    
        this.accountService.newPix(chavePix).subscribe({
          next:() => {
            this.confirmService.successAutoClose("Chave pix alterada com sucesso!","");
            this.chavePix.reset('');
            this.selectedAccountPix = "";
          },
          error:(error) => {
            if (error.error && error.error.message) {
              this.confirmService.error(error.error.message,error.error.subMessage ?? "");
              return;
            }
            this.confirmService.error("Erro ao alterar chave pix","");
          }
        })
  }

  onPriceInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    // remove tudo que nao for numero
    const rawNumbers = input.value.replace(/\D/g, '');

    if (rawNumbers.length === 0) {
      this.valor.setValue('');
      return;
    }

    const numeric = Number(rawNumbers) / 100;

    // atualiza o form control 
    this.valor.setValue(numeric.toString(), { emitEvent: false });

    this.displayPrice = numeric.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });

    // mostra moeda formatada
    input.value = this.displayPrice;
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    const isNumber = /^[0-9]$/.test(event.key);

    if (!isNumber && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}
