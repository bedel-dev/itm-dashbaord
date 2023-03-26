import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogService, FormLayout } from 'ng-devui';
import { FormConfig } from './adduser.type';
import { ListDataService } from 'src/app/@core/mock/list-data.service';

@Component({
  selector: 'da-adduser-form',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss'],
})
export class AddUserComponent implements OnInit {
  @Input() formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    labelSize: 'sm',
    items: [],
  };

  @Input() typeform! :string;

  _formData: any = {};

  @Input() set formData(val: any) {
    this._formData = JSON.parse(JSON.stringify(val));
  }

  @Output() submitted = new EventEmitter();

  @Output() canceled = new EventEmitter();

  constructor(private listDataService: ListDataService, private dialogService: DialogService) {}

  ngOnInit() {
    //console.log(this.typeform)
  }

  AddUserFuction(data:any){

    if(data.pass1 == data.pass2){
      var body ={
        "nomprenom": data.name,
        "pass": data.pass1,
        "username": data.username,
        "mail": data.mail,
        "contact": data.contact,
        "role": data.role
      }
      this.listDataService.addData("add.php","users",body).subscribe((user:any)=>{
        if(user.response.statutCode == 200){
          console.log(user.response.data);
          this.submitted.emit(user.response.data);
         }else if(user.response.statutCode == 401&&user.response.data =="Contact ou username existe deja"){
          this.MadaleInfo(user.response.data)
         }else{
          this.MadaleInfo("impossible d'ajouter")
         }
      },error=>{
        this.MadaleInfo("impossible d'ajouter")
      },()=>{

      })
    }else{
      this.MadaleInfo("Les deux passwords ne sont pas identiquent")
    }
  }
  MadaleInfo(msg: string) {
    const results = this.dialogService.open({
      id: 'delete-dialog',
      width: '346px',
      maxHeight: '600px',
      title: 'Alerte',
      showAnimate: true,
      content: msg,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [
        {
          cssClass: 'primary',
          text: 'Ok',
          disabled: false,
          handler: () => {
            //this.listData.splice(index, 1);
            results.modalInstance.hide();
          },
        },
        // {
        //   id: 'btn-cancel',
        //   cssClass: 'common',
        //   text: 'Cancel',
        //   handler: () => {
        //     results.modalInstance.hide();
        //   },
        // },
      ],
    });
  }


  submitPlanForm({ valid }: { valid: boolean }) {
    if (valid) {
      if(this.typeform == "adduser"){
        this.AddUserFuction(this._formData);
      }
    }
  }

  cancel() {
    this.canceled.emit();
  }
}
