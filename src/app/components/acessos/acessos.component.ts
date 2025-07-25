import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { UserService } from '../../services/user/user.service';
import { HistoryDTO } from '../../models/HistoryDTO';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-acessos',
  imports: [NavBarComponent,MatTableModule,CommonModule],
  templateUrl: './acessos.component.html',
  styleUrls: ['./acessos.component.scss']
})
export class AcessosComponent implements OnInit {

  displayedColumns: string[] = ['data', 'ip'];
  dataSource!: MatTableDataSource<HistoryDTO>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserService, private confirmService: ConfirmService) { }

  ngOnInit(): void {
    this.loadAccessHistory();
  }

  loadAccessHistory() {
    this.userService.getUserHistory().subscribe({
      next: (historyList: HistoryDTO[]) => {
        this.dataSource = new MatTableDataSource(historyList);
        this.dataSource.paginator = this.paginator;

        if (historyList.length === 0) {
          this.confirmService.warningAutoClose("Nenhum registro de acesso encontrado", "");
        }
      },
      error: (error) => {
        this.confirmService.error("Erro ao carregar histórico de acessos", "");
      }
    });
  }
}
