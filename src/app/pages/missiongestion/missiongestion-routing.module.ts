import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BasicFormComponent } from './basic-form/basic-form.component';
import { FormLayoutComponent } from './form-layout/form-layout.component';
import { MissiongestionComponent } from './missiongestion.component';
import { MailAdvanceFormComponent } from './advance-form/advance-form.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';

const routes: Routes = [
  {
    path: '',
    component: MissiongestionComponent,
    children: [
      { path: 'basic-form', component: BasicFormComponent },
      { path: 'form-layout', component: FormLayoutComponent },
      { path: 'advanced-form', component: MailAdvanceFormComponent },
      { path: 'dynamic-form', component: DynamicFormComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MissiongestionRoutingModule {}
