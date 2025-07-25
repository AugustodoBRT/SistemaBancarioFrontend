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
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { Component, OnInit } from '@angular/core';
import { Transference } from '../../models/Transference';

@Component({
  selector: 'app-transferencia',
  imports: [NavBarComponent, MatInputModule, MatSelectModule, MatFormFieldModule, MatButtonModule, ReactiveFormsModule,
    CommonModule, FormsModule, MatIconModule],
  templateUrl: './transferencia.component.html',
  styleUrl: './transferencia.component.scss'
})
export class TransferenciaComponent implements OnInit {

  accountsOrigem$: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);
  accountsDestino$: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);
  selectedAccountOrigem: string = "";
  selectedAccountDestino: string = "";
  valor = new FormControl('');
  displayPrice: string = "";

  constructor(
    private accountService: AccountService,
    private confirmService: ConfirmService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.accountService.getUserAccounts().subscribe({
      next: (accounts) => {
        this.accountsOrigem$.next(accounts);

        this.accountService.getAllAccounts().subscribe({
          next: (allAccounts) => {
            this.accountsDestino$.next(allAccounts);
          },
          error: (error) => {
            if (error.error && error.error.message) {
              this.confirmService.error(error.error.message, error.error.subMessage ?? "");
              return;
            }
            this.confirmService.error("Erro ao recuperar contas do usuário", "");
          }
        })
      },
      error: (error) => {
        if (error.error && error.error.message) {
          this.confirmService.error(error.error.message, error.error.subMessage ?? "");
          return;
        }
        this.confirmService.error("Erro ao recuperar contas do usuário", "");
      }
    });
  }

  onTransference() {
    if (!this.selectedAccountOrigem || !this.selectedAccountDestino || !this.valor.value) {
      this.confirmService.errorAutoClose("Informações inválidas", "A conta de origem, a conta de destino e o valor devem estar preenchidos");
      return;
    }

    if (this.selectedAccountOrigem == this.selectedAccountDestino) {
      this.confirmService.errorAutoClose("Informações inválidas", "A conta de origem não pode ser igual a conta de destino");
      return;
    }

    if (this.valor.value == "0") {
      this.confirmService.errorAutoClose("Informações inválidas", "Não é possível realizar uma transferência com valor 0");
      return;
    }

    const transference: Transference = {
      numeroContaOrigem: this.selectedAccountOrigem,
      numeroContaDestino: this.selectedAccountDestino,
      valor: this.valor.value
    }

    this.accountService.transference(transference).subscribe({
      next:() => {
        this.confirmService.successAutoClose("Transferência realizada com sucesso!","");
        this.valor.reset('');
        this.selectedAccountOrigem = "";
        this.selectedAccountDestino = "";
      },
      error:(error) => {
        if (error.error && error.error.message) {
          this.confirmService.error(error.error.message,error.error.subMessage ?? "");
          return;
        }
        this.confirmService.error("Erro ao realizar transferência","");
      }
    });
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

  onSelectOrigemClick() {
    if (this.accountsOrigem$.getValue().length == 0) {
      this.confirmService.warningAutoClose("Nenhuma conta encontrada", "É possível criar uma conta na seção 'Contas'");
    }
  }

  onSelectDestinoClick() {
    if (this.accountsDestino$.getValue().length == 0) {
      this.confirmService.warningAutoClose("Nenhuma conta encontrada", "É possível criar uma conta na seção 'Contas'");
    }
  }

  goBack() {
    this.router.navigate(['/menu']);
  }
}

