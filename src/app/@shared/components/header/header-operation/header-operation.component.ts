import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/@core/services/auth.service';
import { LANGUAGES } from 'src/config/language-config';
import { User } from '../../../models/user';
import { I18nService } from 'ng-devui/i18n';
import { ListDataService } from 'src/app/@core/mock/list-data.service';

@Component({
  selector: 'da-header-operation',
  templateUrl: './header-operation.component.html',
  styleUrls: ['./header-operation.component.scss'],
})
export class HeaderOperationComponent implements OnInit {
  user!: any;
  languages = LANGUAGES;
  language!: string;
  haveLoggedIn = false;
  noticeCount!: number;

  constructor(private listDataService: ListDataService,private route: Router, private authService: AuthService, private translate: TranslateService, private i18n: I18nService) {}

  ngOnInit(): void {
    if (localStorage.getItem('userinfo')) {
      this.user = JSON.parse(localStorage.getItem('userinfo')!);
      this.haveLoggedIn = true;
      this.getAllNotification()

      setInterval(() => {
        this.getNewnotification()
      }, 2000);
    } else {
      this.authService.logout();
      this.route.navigate(['/', 'login']);
      // this.authService.login('Admin', 'Devui.admin').subscribe((res) => {
      //   this.authService.setSession(res);
      //   this.user = JSON.parse(localStorage.getItem('userinfo')!);
      //   this.haveLoggedIn = true;
      // });
    }
    this.language = this.translate.currentLang;

    this.onLanguageClick("en-us")
  }

  getNewnotification(){
    this.listDataService.getListAllData("list.php","notif").subscribe((notification:any)=>{
       notification.response.data.forEach((element:any) => {
        if(element.state =="non lu"){
          var notif =   this.AllNotification.filter((n:any)=>{
            return n.id.toString()==element.id.toString()
          })
          if(notif.length==0){
            this.AllNotification.push(element)
          }
          //console.log(notif)
        }
       });
       //console.log("notif",notification.response.data)
    })
  }
  AllNotification:any[]=[];
  getAllNotification(){
    this.AllNotification = [];
    this.listDataService.getListAllData("list.php","notif").subscribe((notification:any)=>{
       notification.response.data.forEach((element:any) => {
        if(element.state =="non lu"){
          this.AllNotification.push(element)
        }
       });
       console.log("notif",notification.response.data)
    })
  }
  onSearch(event: any) {
    console.log(event);
  }

  onLanguageClick(language: string) {
    console.log(language);
    this.language = "en-us";
    localStorage.setItem('lang', this.language);
    this.i18n.toggleLang(this.language);
    this.translate.use(this.language);
  }

  handleUserOps(operation: string) {
    switch (operation) {
      case 'logout': {
        this.haveLoggedIn = false;
        this.authService.logout();
        this.route.navigate(['/', 'login']);
        break;
      }
      default:
        break;
    }
  }

  handleNoticeCount(event: number) {
    this.noticeCount = event;
  }
}
