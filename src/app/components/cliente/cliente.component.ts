import { Component } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { Client } from '../../models/Client';
import { ClientService } from '../../services/client/client.service';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { CommonModule } from '@angular/common';
import { cpfLengthValidator } from '../../validators/cpfLengthValidator';
import { telefoneLengthValidator } from '../../validators/telefoneLengthValidator';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-cliente',
  imports: [MatInputModule, MatFormFieldModule, ReactiveFormsModule,CommonModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss'
})
export class ClienteComponent {
  nome = new FormControl('', [Validators.required, Validators.minLength(3),Validators.maxLength(50)]);
  cpf = new FormControl('', [Validators.required, cpfLengthValidator()]);
  email = new FormControl('',[Validators.required,Validators.email])
  senha = new FormControl('', [Validators.required,Validators.minLength(3),Validators.maxLength(20)]);
  telefone = new FormControl('', [Validators.required, telefoneLengthValidator()]);

  constructor(
    private router: Router,
    private clientService: ClientService,
    private confirmService: ConfirmService
  ) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  onRegister() {
    if (this.nome.invalid || this.cpf.invalid || this.senha.invalid || this.telefone.invalid) {
      this.confirmService.error("Informações inválidas","Por favor, preencha todos os campos corretamente");
      return;
    }

    const client: Client = {
      nome: this.nome.value ?? "",
      cpf: this.cpf.value ?? "",
      email: this.email.value ?? "",
      senha: this.senha.value ?? "",
      telefone: this.telefone.value ?? ""
    };

    this.clientService.registerClient(client).subscribe({
      next: () => {
        this.confirmService.successAutoClose("Cadastro realizado com sucesso!", "");
        this.router.navigate(['/login']);
      },
      error: (error) => {
        if (error.error && error.error.message) {
          this.confirmService.error(error.error.message,error.error.subMessage ?? "");
          return;
        }
        this.confirmService.error("Erro ao cadastrar", "Por favor, verifique as informações inseridas");
      }
    });
  }
}
