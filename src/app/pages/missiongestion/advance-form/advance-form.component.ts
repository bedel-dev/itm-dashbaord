import { formatDate } from '@angular/common';
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
  typeformulaire:string = "addmission";
  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  listData: any[] = [];

  headerNewForm = false;

   formConfig!: FormConfig;
   daytoday = new Date();

  defaultRowData = {
    objet: '',
    message: '',
    datebegin: this.daytoday,
    datefin: this.daytoday,
    ouvrier: 'Choisissez un ouvrier',
    adresse:""
  };

  priorities = ['Low', 'Medium', 'High','Await'];

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
      width: '100px',
    },
    {
      field: 'date',
      width: '100px',
    },
    {
      field: 'adresse',
      width: '100px',
    },
    {
      field: 'Actions',
      width: '190px',
    },
  ];

  constructor(private listDataService: ListDataService, private dialogService: DialogService) {}

  ngOnInit() {
    this.getUser();

  }

  RefreshList() {
    this.getUser();
  }
  onEditEnd(rowItem: any, field: any) {
    rowItem[field] = false;
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
      this.getList();
    })
  }
  getList() {
    // this.busy = this.listDataService.getListData(this.pager).subscribe((res) => {
    //   res.pageList.$expandConfig = { expand: false };
    //   this.listData = res.pageList;
    //   this.pager.total = res.total;
    // });
    this.OuvrierOptions = [];
    this.busy = this.listDataService.getListAllData("list.php","mission").subscribe((res:any) => {
      console.log(res);
      if(res.response.data !== "Aucun utilisateur trouvé"){

        res.response.data.forEach((element:any) => {
          const format = 'dd/MM/yyyy';
          const locale = 'en-US';
          var date = element.createdat.split(" ")[0]
          const formattedDate = formatDate(date, format, locale);
          element.createdat=formattedDate;

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
          if(element.idclient =="administrateur"){
            element.clientnom = element.idclient
          }else{
            var client = this.clientAll.find((item:any)=>{
              return item.id.toString() == element.idclient;
            });
            if(client){
              element.clientnom = client.nomprenom
              element.clientcontact = client.contact
            }
          }

          if(element.datefinmission.toString() == "null"){
            element.datefinmission = "Aucun"
          }
          if(element.datedebutmission.toString() == "null"){
            element.datedebutmission = "Aucun"
          }
            //labelStyle]="rowItem?.priority"

          if(element.state =="initier"){
             element.priority = "red";
          }else if(element.state =="en cours"){
             element.priority = "green";
          }else if(element.state == "terminer"){
             element.priority = "mediumvioletred";
          }else if(element.state == "accepter"){
             element.priority = "orange";
          }
      });
      this.ouvierAll.forEach((ouvrier:any)=>{
       var ou =  res.response.data.filter((mission:any) => {
          return mission.idouvrier == ouvrier.id.toString()&&(mission.state=="en cours"||mission.state=="accepter")
        })

        if(ou.length == 0){
          this.OuvrierOptions.push(ouvrier);
        }



      })

      //console.log("ouvrier libre",this.OuvrierOptions);
      res.pageList = res.response.data.slice(this.pager.pageSize! * (this.pager.pageIndex! - 1), this.pager.pageSize! * this.pager.pageIndex!)
      res.pageList.reverse();
      res.pageList.$expandConfig = { expand: false };
      res.total = res.response.data.length;
      this.listData = res.pageList;
      this.pager.total = res.total;
      this.CreateAddMission();
      // if(this.listData.length==0){
      //   var rep = {
      //     "createdat": "2023-03-26"
      //   };
      //   this.listData.push(rep);
      // }




      }else{
        console.log("Ouvrier");
        this.headerNewForm = true;
        console.log(this.headerNewForm);
      }
    });
  }
  isEmpty:Boolean = false;
  CreateAddMission(){
    this.formConfig = {
      layout: FormLayout.Horizontal,
      labelSize: 'sm',
      items: [
        {
          label: 'Objet',
          prop:  'objet',
          fonction:"text",
          type: 'input',
          required: true,
          rule: {
            validators: [{ required: true }],
          },
        },
        {
          label: 'Message',
          prop: 'message',
          fonction:"text",
          type: 'input',
          required: true,
          rule: {
            validators: [{ required: true }],
          },
        },
        {
          label: 'Date debut',
          prop: 'datebegin',
          type: 'datePicker',
          fonction:"date",
          required: true,
          rule: {
            validators: [{ required: true }],
          },
        },
        {
          label: 'Date fin',
          prop: 'datefin',
          type: 'datePicker',
          fonction:"date2",
          required: true,
          rule: {
            validators: [{ required: true }],
          },
        },
        {
          label: "Ouvrier",
          prop: 'ouvrier',
          type: 'select',
          options: this.OuvrierOptions,
          required: true,
          rule: {
            validators: [{ required: true }],
          },
        },
        {
          label: "Adresse",
          prop: 'adresse',
          type: 'input',
          fonction:"text",
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
    this.RefreshList();
    this.headerNewForm = false;
    // const newData = { ...e };
    // this.listData.unshift(newData);
    // this.headerNewForm = false;
  }

  Actualise(e: any)     {
    //const d = { ...e };
    console.log("console :",e);
    if(e==true){

    }
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
      //console.log(action);
    }
  }

  Retour(){
    this.accepteMission = false;
  }
  Action(objet:any,action:any,etat:any){
    if(action =="accepter"){
      //console.log(action);
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

  Alert(data: any,state:string) {
    var mot = "";
    if(state ==="en cours"){
      mot = "debuté"
    }else if(state ==="terminer"){
      mot = "terminé"
    }
    const results = this.dialogService.open({
      id: 'delete-dialog',
      width: '346px',
      maxHeight: '600px',
      title: 'Alerte',
      showAnimate: false,
      content:"Voulez-vous vraiment "+mot+" la mission ?",
      backdropCloseable: true,
      onClose: () => {},
      buttons: [
        {
          cssClass: 'primary',
          text: 'Ok',
          disabled: false,
          handler: () => {
            this.UpdateMission(data,state,results)
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
  disabled:boolean = true;
  adresse:string = " ";
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
  UpdateMission(rowItem:any,state:string,results:any){

    console.log(rowItem);

    var body = {
      idmission:rowItem.id,
      state:state
    }
    results.modalInstance.hide();
    this.listDataService.addData("update_state.php","mission",body).subscribe((data:any)=>{
      console.log(data);
      if(data.response.statutCode==200){
        this.getUser();
        results.modalInstance.hide();
      }
     })
  }

  submitProjectForm({ valid, directive, data, errors }: any) {
    if (valid) {
      // console.log(this.datebegin,this.datefin,this.ouvrier,this.missionAction)
      const format = 'dd/MM/yyyy';
      const locale = 'en-US';
      const formattedDateBegin = formatDate(this.datebegin, format, locale);
      const formattedDateFin = formatDate(this.datefin, format, locale);
      var body = {
        idmission:this.missionAction.id,
        idouvrier:this.ouvrier.id,
        datedebutmission:formattedDateBegin,
        datefinmission:formattedDateFin,
        state:"accepter"
      }
       this.listDataService.addData("update.php","mission",body).subscribe((data:any)=>{
        if(data.response.statutCode==200){
          this.ouvrier = '';
          this.accepteMission = false;
          this.getUser();
        }
       })
      // do something
    } else {
      // error tip
    }
  }
}
