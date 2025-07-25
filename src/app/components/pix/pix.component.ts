import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Account } from '../../models/Account';
import { Transference } from '../../models/Transference';
import { AccountService } from '../../services/account/account.service';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-pix',
  imports: [NavBarComponent, MatInputModule, MatSelectModule, MatFormFieldModule, MatButtonModule, ReactiveFormsModule,
    CommonModule, FormsModule, MatIconModule],
  templateUrl: './pix.component.html',
  styleUrl: './pix.component.scss'
})
export class PixComponent {
  accountsOrigem$: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);
  selectedAccountOrigem: string = "";
  chavePix: string = "";
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

  onPix() {
    if (!this.selectedAccountOrigem || !this.chavePix || !this.valor.value) {
      this.confirmService.errorAutoClose("", "Todos os itens devem estar preenchidos");
      return;
    }

    this.accountService.getAccountPix(this.chavePix).subscribe({
      next: (account: Account) => {
        if (this.selectedAccountOrigem == account.numero) {
          this.confirmService.errorAutoClose("", "A conta de destino não pode ser igual a conta de origem");
          return;
        }

        if (this.valor.value == "0") {
          this.confirmService.errorAutoClose("", "Valor deve ser maior que 0");
          return;
        }

        this.selectedAccountDestino = account.numero;

        const transference: Transference = {
          numeroContaOrigem: this.selectedAccountOrigem,
          numeroContaDestino: this.selectedAccountDestino,
          valor: this.valor.value!
        }

        this.accountService.pixTransference(transference).subscribe({
          next: () => {
            this.confirmService.successAutoClose("Transferência realizada com sucesso!", "");
            this.valor.reset('');
            this.selectedAccountOrigem = "";
            this.selectedAccountDestino = "";
          },
          error: (error) => {
            if (error.error && error.error.message) {
              this.confirmService.error(error.error.message, error.error.subMessage ?? "");
              return;
            }
            this.confirmService.error("Erro ao realizar transferência", "");
          }
        });
      },
      error:() => {
        this.confirmService.errorAutoClose("","A chave pix informada não foi encontrada");
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

  onSelectOrigemClick() {
    if (this.accountsOrigem$.getValue().length == 0) {
      this.confirmService.warningAutoClose("", "Nenhuma conta encontrada");
    }
  }

  goBack() {
    this.router.navigate(['/menu']);
  }
}
