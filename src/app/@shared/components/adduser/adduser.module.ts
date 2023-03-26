import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './adduser.component';
import { ButtonModule, DatepickerModule, FormModule, SelectModule } from 'ng-devui';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormModule, DatepickerModule, FormsModule, SelectModule, ButtonModule],
  declarations: [AddUserComponent],
  exports: [AddUserComponent],
})
export class AddUserModule {}
