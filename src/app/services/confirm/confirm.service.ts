import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  });

  confirm(
    message: string,
    confirmButtonText: string = 'Confirmar',
    cancelButtonText: string = 'Cancelar'
  ): Promise<boolean> {
    return this.swalWithBootstrapButtons.fire({
      title: 'Confirmação',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      reverseButtons: true
    }).then(result => result.isConfirmed);
  }

  successAutoClose(title: string, text: string) {
    return this.swalWithBootstrapButtons.fire({
      title,
      text,
      icon: 'success',
      showConfirmButton: false,  
      timer: 1000,            
      timerProgressBar: true     
    });
  }
 
  error(title: string, text: string) {
    return this.swalWithBootstrapButtons.fire({
      title,
      text,
      icon: 'error'
    });
  }

  errorAutoClose(title: string, text: string) {
    return this.swalWithBootstrapButtons.fire({
      title,
      text,
      icon: 'error',
      showConfirmButton: false,  
      timer: 1500,            
      timerProgressBar: true    
    });
  }

  warningAutoClose(title: string, text: string) {
    return this.swalWithBootstrapButtons.fire({
      title,
      text,
      icon: 'warning',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    });
  }
}
