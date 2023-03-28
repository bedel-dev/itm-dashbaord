import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogService, FormLayout } from 'ng-devui';
import { FormConfig } from './adduser.type';
import { ListDataService } from 'src/app/@core/mock/list-data.service';
import { formatDate } from '@angular/common';

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
  change(data:any,item:any){
    if(item.prop=="datebegin"){
      this._formData.datefin = data;
    }
  }

  ngOnInit() {
    //console.log(this.typeform)
    if(this.typeform == "addmission") {
      this.getUser()
    }
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
  userAll:any[]=[];
  ouvierAll:any[]=[];
  clientAll:any[]=[];
  getUser(){
    this.userAll = [];
    this.ouvierAll = [];
    this.clientAll = [];
    this.listDataService.getListAllData("list.php","users").subscribe((data:any)=>{
      data.response.data.forEach((element:any) => {

        if(element.role == "ouvrier"){
          this.ouvierAll.push(element);
        }

        if(element.role == "client"){
          this.clientAll.push(element);
        }
        this.userAll.push(element);
      });
      //console.log(this.userAll);
    },error=>{

    },()=>{
      //this.getList();
    })
  }
  AddMissionFuction(data:any){

    console.log(data);

    if(data){
      const format = 'dd/MM/yyyy';
      const locale = 'en-US';
      var datedebut = data.datebegin
      const formattedDatedebut = formatDate(datedebut, format, locale);

      var datedin = data.datefin
      const formattedDatefin = formatDate(datedin, format, locale);
      var body = {
        "information": data.message,
        "idouvrier": data.ouvrier.id,
        "idclient": "administrateur",
        "state": "accepter",
        "motif": data.objet,
        "datefinmission": formattedDatefin,
        "datedebutmission": formattedDatedebut,
      }
      this.listDataService.addData("add.php","mission",body).subscribe((user:any)=>{
        if(user.response.statutCode == 200){
          var ouvrier = this.ouvierAll.find((item:any)=>{
            return item.id.toString() == user.response.data.idouvrier;
          });

          if(ouvrier){
            user.response.data.ouvriernom = ouvrier.nomprenom
          }
          user.response.data.clientnom =  user.response.data.idclient
         if(user.response.data.state =="initier"){
            user.response.data.priority = "red";
         }else if(user.response.data.state =="en cours"){
          user.response.data.priority = "green";
         }else if(user.response.data.state == "terminer"){
          user.response.data.priority = "mediumvioletred";
         }else if(user.response.data.state == "accepter"){
          user.response.data.priority = "orange";
         }

         const format = 'dd/MM/yyyy';
         const locale = 'en-US';
         var date =  user.response.data.createdat.split(" ")[0]
         const formattedDate = formatDate(date, format, locale);
         user.response.data.createdat=formattedDate;

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

  submitPlanForm({ valid }: { valid: boolean }) {
    if (valid) {
      if(this.typeform == "adduser"){
        this.AddUserFuction(this._formData);
      }else if(this.typeform == "addmission"){
        this.AddMissionFuction(this._formData);
      }
    }
  }

  cancel() {
    this.canceled.emit();
  }
}
