import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-forgot-password',
  imports: [MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, NgxMaskDirective, MatDialogModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskDirective
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [provideNgxMask()],
  standalone: true
})
export class ForgotPassword {
  cpf = new FormControl('', [Validators.required]);

  constructor(private dialogRef: MatDialogRef<ForgotPassword>) { }

  onConfirm() {
    if (this.cpf.valid) {
      this.dialogRef.close(this.cpf.value);
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
