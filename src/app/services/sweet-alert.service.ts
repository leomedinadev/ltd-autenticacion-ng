import { Injectable } from '@angular/core';
import Swal, {SweetAlertIcon} from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {

  success(message: string) {
    return this.show('Operación Realizada con Éxito', message, 'success');
  }

  error(message: string) {
    return this.show('Ha Ocurrido un error', message, 'error');
  }

  warning(message: string) {
    return this.show('Alerta', message, 'warning');
  }

  info(message: string) {
    return this.show('Por favor revisar', message, 'info');
  }

  question(message: string) {
    return this.show('Está seguro?', message, 'question');
  }

  private show(
    title: string,
    text: string,
    icon: SweetAlertIcon = 'info'
  ) {
    return Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor: '#3085d6'
    });
  }

  showCustom(title: string, text: string, icon: SweetAlertIcon) {
    return this.show(title, text, icon);
  }

  showCustomQuestion(title: string, text: string, textConfirm?: string, textCancel?: string) {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      confirmButtonColor: '#3085d6',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: textConfirm ?? 'Sí',
      cancelButtonText: textCancel ?? 'No',
    })
  }
}
