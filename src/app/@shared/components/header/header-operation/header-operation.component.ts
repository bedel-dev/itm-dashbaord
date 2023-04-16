import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/@core/services/auth.service';
import { LANGUAGES } from 'src/config/language-config';
import { User } from '../../../models/user';
import { I18nService } from 'ng-devui/i18n';
import { ListDataService } from 'src/app/@core/mock/list-data.service';
import { ToastService } from 'ng-devui';

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

  constructor(private router: Router,private toastService: ToastService,private listDataService: ListDataService,private route: Router, private authService: AuthService, private translate: TranslateService, private i18n: I18nService) {}

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
      if(notification.response.data !== "Aucune notification trouvé"){
        var userconnected = JSON.parse(localStorage.getItem("userinfo")!);

        notification.response.data.forEach((element:any) => {
          if((element.state == "non lu" || element.state == "showed") && (element.iduser == userconnected.id||element.iduser == "administrateur")){
            var notif =   this.AllNotification.filter((n:any)=>{
              return n.id.toString()==element.id.toString()
            })
            if(notif.length==0){
              this.toastService.open({
                value: [
                  {
                    severity: 'info',
                    summary: "Notications",
                    content: "Une nouvelle mission initiée...",
                  },
                ],
                life: 2000,
              });
              this.AllNotification.push(element)
            }
            //console.log(notif)
          }else if(element.state =="lu"){
            this.AllNotification = this.AllNotification.filter((n:any) =>{
              return n.id.toString() !== element.id.toString()
            })
          }
         });
      }

       //console.log("notif",notification.response.data)
    })
  }
  AllNotification:any[]=[];
  getAllNotification(){
    var userconnected = JSON.parse(localStorage.getItem("userinfo")!);

    this.AllNotification = [];
    this.listDataService.getListAllData("list.php","notif").subscribe((notification:any)=>{
      console.log(notification.response.data)
      if(notification.response.data !== "Aucune notification trouvé"){

          notification.response.data.forEach((element:any) => {
          if((element.state == "non lu" || element.state == "showed") && (element.iduser == userconnected.id||element.iduser == "administrateur"))
          {
            this.AllNotification.push(element)
          }
         });
      }
       //console.log("notif",notification.response.data)
    })
  }
  onSearch(event: any) {
    console.log(event);
  }
  ViewAllMission(){

    var niveau = this.AllNotification.length;

    this.AllNotification.forEach((notif:any)=>{

      var userconnected = JSON.parse(localStorage.getItem("userinfo")!);
      var body = {
        idnotif:notif.id.toString(),
        state:"lu"
      }
      console.log(userconnected,notif.iduser);

      if(userconnected.id== notif.iduser || notif.iduser == "administrateur"){
        this.listDataService.addData("update.php","notif",body).subscribe((response:any)=>{
          if(response.response.data=="notification updated"){
            niveau = niveau-1
          }
          console.log(response.response.data,niveau)
          if(niveau==0){
            this.router.navigate(['/pages/missiongestion/advanced-form']);
          }
        })
      }else{
        this.router.navigate(['/pages/missiongestion/advanced-form']);
      }
    })




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
    //console.log("no",event);
    this.noticeCount = event;
  }
}
