import { Component, OnInit, ViewChild } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { Account } from '../../models/Account';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account/account.service';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { CommonModule } from '@angular/common';
import { BankStatement } from '../../models/BankStatement';
import { BankStatementService } from '../../services/bank-statement/bank-statement.service';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-extrato',
  imports: [NavBarComponent, MatSelectModule, MatTableModule, CommonModule, FormsModule, MatPaginatorModule, MatIconModule],
  templateUrl: './extrato.component.html',
  styleUrl: './extrato.component.scss'
})
export class ExtratoComponent implements OnInit {

  displayedColumns: string[] = ['data', 'valor', 'tipo','tipoOperacao'];
  dataSource!: MatTableDataSource<BankStatement>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  accounts$: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);
  bankStatements$: BehaviorSubject<BankStatement[]> = new BehaviorSubject<BankStatement[]>([]);

  selectedAccount: string = "";

  constructor(private router: Router, private accountService: AccountService, private bankStatementService: BankStatementService, private confirmService: ConfirmService) { }

  ngOnInit(): void {
    this.accountService.getUserAccounts().subscribe({
      next: (accounts) => {
        this.accounts$.next(accounts);
      },
      error: (error) => {
        if (error.error && error.error.message) {
          this.confirmService.error(error.error.message, error.error.subMessage ?? "");
          return;
        }
        this.confirmService.error("Erro ao recuperar contas do usuário", "");
      }
    })
  }

  onSearch() {
    if (!this.selectedAccount) {
      this.confirmService.errorAutoClose("Informações inválidas", "Por favor, selecione a conta da qual deseja visualizar o extrato");
      return;
    }

    this.bankStatementService.getAccountBankStatements(this.selectedAccount).pipe(
      map((bankStatements: BankStatement[]) => {
        return bankStatements.sort((a, b) => {
          return this.parseDate(b.data).getTime() - this.parseDate(a.data).getTime(); // ordena as datas de forma decrescente
        });
      })
    ).subscribe({
      next: (bankStatements: BankStatement[]) => {
        this.bankStatements$.next(bankStatements);

        this.dataSource = new MatTableDataSource(bankStatements);
        this.dataSource.paginator = this.paginator;

        if (bankStatements.length == 0) {
          this.confirmService.warningAutoClose("Não foram encontrados extratos para a conta informada", "");
        }
      },
      error: (error) => {
        if (error.error && error.error.message) {
          this.confirmService.error(error.error.message, error.error.subMessage ?? "");
          return;
        }
        this.confirmService.error("Erro ao recuperar o extrato da conta " + this.selectedAccount, "");
      }
    });
  }

  parseDate(dateStr: string): Date {
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes, seconds);
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
