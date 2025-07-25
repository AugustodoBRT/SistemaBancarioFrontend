import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from '../../services/account/account.service';
import { BehaviorSubject } from 'rxjs';
import { Account } from '../../models/Account';
import { WithDrawalService } from '../../services/withdrawal/withdrawal.service';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { CommonModule } from '@angular/common';
import { Withdrawal } from '../../models/Withdrawal';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-saque',
  standalone: true,
  imports: [NavBarComponent, MatInputModule, MatSelectModule, MatFormFieldModule, MatButtonModule, ReactiveFormsModule, 
    CommonModule, FormsModule,MatIconModule],
  templateUrl: './saque.component.html',
  styleUrls: ['./saque.component.scss']
})
export class SaqueComponent implements OnInit {

  accounts$: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);
  selectedAccount: string = "";
  valor = new FormControl('');
  displayPrice: string = "";

  constructor(
    private accountService: AccountService,
    private withdrawalService: WithDrawalService,
    private confirmService: ConfirmService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.accountService.getUserAccounts().subscribe({
      next: (accounts) => {
        this.accounts$.next(accounts);
      },
      error: (error) => {
        if (error.error && error.error.message) {
          this.confirmService.error(error.error.message,error.error.subMessage ?? "");
          return;
        }
        this.confirmService.error("Erro ao recuperar contas do usuário", "");
      }
    });
  }

  onWithdrawal() {
    if (!this.selectedAccount || !this.valor.value) {
      this.confirmService.errorAutoClose("Informações inválidas","Tanto a conta quanto o valor devem estar preenchidos");
      return;
    }

    if (this.valor.value == "0") {
      this.confirmService.errorAutoClose("Informações inválidas","Não é possível realizar um saque com valor 0");
      return;
    }

    const withdrawal: Withdrawal = {
      numeroConta: this.selectedAccount,
      valor: this.valor.value
    }

    this.withdrawalService.withdraw(withdrawal).subscribe({
      next:() => {
        this.confirmService.successAutoClose("Saque realizado com sucesso!","");
        this.valor.reset('');
        this.selectedAccount = "";
      },
      error:(error) => {
        if (error.error && error.error.message) {
          this.confirmService.error(error.error.message,error.error.subMessage ?? "");
          return;
        }
        this.confirmService.error("Erro ao sacar","");
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

  onSelectClick() {
    if (this.accounts$.getValue().length == 0){
      this.confirmService.warningAutoClose("Nenhuma conta encontrada","É possível criar uma conta na seção 'Contas'");
    }
  }

  goBack() {
    this.router.navigate(['/menu']);
  }
}
