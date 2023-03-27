import { Component, OnInit } from '@angular/core';
import { DialogService, EditableTip, FormLayout, TableWidthConfig } from 'ng-devui';
import { Subscription } from 'rxjs';
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
      field: 'id',
      width: '150px',
    },
    {
      field: 'title',
      width: '200px',
    },
    {
      field: 'priority',
      width: '110px',
    },
    {
      field: 'iteration',
      width: '110px',
    },
    {
      field: 'assignee',
      width: '150px',
    },

    {
      field: 'Actions',
      width: '120px',
    },
  ];

  constructor(private listDataService: ListDataService, private dialogService: DialogService) {}

  ngOnInit() {
    this.getList();
  }

  onEditEnd(rowItem: any, field: any) {
    rowItem[field] = false;
  }

  getList() {
    // this.busy = this.listDataService.getListData(this.pager).subscribe((res) => {
    //   res.pageList.$expandConfig = { expand: false };
    //   this.listData = res.pageList;
    //   this.pager.total = res.total;
    // });

    this.busy = this.listDataService.getListAllData("list.php","mission").subscribe((res:any) => {
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

  deleteRow(index: number) {
    const results = this.dialogService.open({
      id: 'delete-dialog',
      width: '346px',
      maxHeight: '600px',
      title: 'Alerte',
      showAnimate: false,
      content: 'Voulez-vous vraiment supprimer cette ligne',
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
}
