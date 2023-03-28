import { Component, OnInit } from '@angular/core';
import { DialogService, EditableTip, FormLayout, TableWidthConfig } from 'ng-devui';
import { Observable, Subscription, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Item, ListPager } from 'src/app/@core/data/listData';
import { ListDataService } from 'src/app/@core/mock/list-data.service';
import { FormConfig } from 'src/app/@shared/components/admin-form';

@Component({
  selector: 'da-advance-mailadvance',
  templateUrl: './advance-form.component.html',
  styleUrls: ['./advance-form.component.scss'],
})
export class MailAdvanceFormComponent implements OnInit {
  editableTip = EditableTip.btn;
  nameEditing!: boolean;
  busy!: Subscription;
  typeformulaire:string = "adduser";
  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  listData: Item[] = [];

  headerNewForm = false;

  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    labelSize: 'sm',
    items: [
      {
        label: 'Nom & Prenom',
        prop: 'name',
        fonction:"text",
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'Contact',
        prop: 'contact',
        fonction:"number",
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'Email',
        prop: 'mail',
        type: 'input',
        fonction:"email",
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'Password',
        prop: 'pass1',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'Password',
        prop: 'pass2',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: "Username",
        prop: 'username',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: "Role",
        prop: 'role',
        type: 'select',
        options: ['Admin', 'client', 'ouvrier'],
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      // {
      //   label: 'Timeline',
      //   prop: 'timeline',
      //   type: 'datePicker',
      // },
    ],
  };

  defaultRowData = {
    name: '',
    contact: '',
    mail: '',
    pass1: '',
    pass2: '',
    username: '',
    role: 'Choisissez un role',
  };

  priorities = ['Low', 'Medium', 'High'];

    tableWidthConfig: TableWidthConfig[] = [
    {
      field: 'objet',
      width: '150px',
    },
    {
      field: 'message',
      width: '200px',
    },
    {
      field: 'debut',
      width: '110px',
    },
    {
      field: 'fin',
      width: '110px',
    },
    {
      field: 'ouvrier',
      width: '150px',
    },
    {
      field: 'client',
      width: '150px',
    },
    {
      field: 'statut',
      width: '150px',
    },
    {
      field: 'date',
      width: '100px',
    },
    {
      field: 'Actions',
      width: '150px',
    },
  ];

  constructor(private listDataService: ListDataService, private dialogService: DialogService) {}

  ngOnInit() {
    this.getUser();
  }

  onEditEnd(rowItem: any, field: any) {
    rowItem[field] = false;
  }
  userAll:any[]=[];
  ouvierAll:any[]=[];
  clientAll:any[]=[];
  getUser(){
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
      console.log(this.userAll);
    },error=>{

    },()=>{
      this.getList();
    })
  }
  getList() {
    // this.busy = this.listDataService.getListData(this.pager).subscribe((res) => {
    //   res.pageList.$expandConfig = { expand: false };
    //   this.listData = res.pageList;
    //   this.pager.total = res.total;
    // });

    this.busy = this.listDataService.getListAllData("list.php","mission").subscribe((res:any) => {
        res.response.data.forEach((element:any) => {
          if(element.state !=="initier"){
            var ouvrier = this.ouvierAll.find((item:any)=>{
              return item.id.toString() == element.idouvrier;
            });
            if(ouvrier){
              element.ouvriernom = ouvrier.nomprenom
            }
          }else if(element.state =="initier"){
            element.ouvriernom = "Aucun"
          }
          var client = this.clientAll.find((item:any)=>{
            return item.id.toString() == element.idclient;
          });
          if(client){
            element.clientnom = client.nomprenom
            element.clientcontact = client.contact
          }
          if(element.datefinmission == "null"){
            element.datefinmission = "aucun"
          }
          if(element.datedebutmission == "null"){
            element.datedebutmission = "aucun"
          }

          if(element.state =="initier"){
            element.priority = "High";
          }else if(element.state =="en cours"){
            element.priority = "Low";
          }else if(element.state == "terminer"){
            element.priority = "Medium";
          }
      });
      this.ouvierAll.forEach((ouvrier:any)=>{
       var ou =  res.response.data.filter((mission:any) => {
          return mission.idouvrier == ouvrier.id.toString()&&(mission.state=="en cours")
        })

        if(ou.length == 0){
          this.OuvrierOptions.push(ouvrier);
        }


      })

      //console.log("ouvrier libre",this.OuvrierOptions);
      res.pageList = res.response.data.slice(this.pager.pageSize! * (this.pager.pageIndex! - 1), this.pager.pageSize! * this.pager.pageIndex!)
      res.pageList.$expandConfig = { expand: false };
      res.total = res.response.data.length;
      this.listData = res.pageList;
      this.pager.total = res.total;
      console.log(res);
    });
  }



  beforeEditStart = (rowItem: any, field: any) => {
    return true;
  };

  beforeEditEnd = (rowItem: any, field: any) => {
    // TODO: update data here automatically
    // console.log(rowItem);
    if(rowItem && rowItem[field].length < 3) {
      return false;
    } else {
      return true;
    }
  };

  newRow() {
    this.headerNewForm = true;
  }

  getuuid() {
    return new Date().getTime() + 'CNWO';
  }

  quickRowAdded(e: any) {
    const newData = { ...e };
    this.listData.unshift(newData);
    this.headerNewForm = false;
  }

  quickRowCancel() {
    this.headerNewForm = false;
  }

  subRowAdded(index: number) {
    this.listData[index].$expandConfig.expand = false;
    const newData = { ...this.defaultRowData };
    //this.listData.splice(index + 1, 0, newData);
  }

  subRowCancel(index: number) {
    this.listData[index].$expandConfig.expand = false;
  }

  toggleExpand(rowItem: Item) {
    if (rowItem.$expandConfig) {
      rowItem.$expandConfig.expand = !rowItem.$expandConfig.expand;
    }
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.getList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.getList();
  }
  accepteMission:boolean = false;
  missionAction:any;
  openView(objet:any,action:any,etat:any){
    if(action =="accepter"){
      this.client = objet.clientnom
      //this.ouvrier = objet.ouvriernom
      var today = new Date();
      this.datebegin = today
      this.missionAction = objet;
      this.accepteMission = true;
      console.log(action);
    }
  }

  Retour(){
    this.accepteMission = false;

  }
  Action(objet:any,action:any,etat:any){
    if(action =="accepter"){
      console.log(action);
    }
  }

  deleteRow(index: number) {
    const results = this.dialogService.open({
      id: 'delete-dialog',
      width: '346px',
      maxHeight: '600px',
      title: 'Alerte',
      showAnimate: false,
      content:"Voulez-vous vraiment supprimer ?",
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
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: 'Cancel',
          handler: () => {
            results.modalInstance.hide();
          },
        },
      ],
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  client:any;
  ouvrier:any;
  datebegin:any;
  datefin:any;
  disabled:boolean = true
  // projectFormData = {
  //   client: '',
  //   ouvrier: null,
  //   projectExecutor: null,
  //   projectCycleTime: [null, null],
  //   projectSecurity: 'Only member visible',
  //   projectDescription: '',
  //   projectExerciseDate: [{ id: '1', label: 'Mon' }],
  // };

  verticalLayout: FormLayout = FormLayout.Vertical;

  existprojectNames = ['123', '123456', 'DevUI'];

  checkboxOptions = [
    { id: '1', label: 'Mon' },
    { id: '2', label: 'Tue' },
    { id: '3', label: 'Wed' },
    { id: '4', label: 'Thur' },
    { id: '5', label: 'Fri' },
    { id: '6', label: 'Sat' },
  ];

  securityValue = ['Public', 'Only member visible'];

  OwnerOptions = [
    { id: '1', name: 'Owner1' },
    { id: '2', name: 'Owner2' },
    { id: '3', name: 'Owner3' },
    { id: '4', name: 'Owner4' },
  ];

  OuvrierOptions:any[] = [];

  getValue(value: object) {
    console.log(value);
  }

  everyRange(range: any) {
    return range.every((_: any) => !!_);
  }

  checkName(value: string) {
    let res = true;
    if (this.existprojectNames.indexOf(value) !== -1) {
      res = false;
    }
    return of(res).pipe(delay(500));
  }

  validateDate(value: any): Observable<any | null> {
    let message = null;
    for (const item of value) {
      if (item.id === '2') {
        message = {
          'zh-cn': `当前日期队列已满`,
          'en-us': 'The task queue on the current execution day (Tuesday) is full.',
        };
      }
    }
    // Returned by the simulated backend interface
    return of(message).pipe(delay(300));
  }

  submitProjectForm({ valid, directive, data, errors }: any) {
    if (valid) {
      // do something
    } else {
      // error tip
    }
  }
}
