import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { DValidateRules } from 'ng-devui';
import { FormLayout } from 'ng-devui';
import { I18nService } from 'ng-devui/i18n';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/@core/services/auth.service';
import { PersonalizeService } from 'src/app/@core/services/personalize.service';
import { LANGUAGES } from 'src/config/language-config';
import { environment } from 'src/environments/environment';
import { ThemeType } from '../../models/theme';
import { ListDataService } from 'src/app/@core/mock/list-data.service';

@Component({
  selector: 'da-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.scss'],
})
export class RestPassComponent implements OnInit {
  private destroy$ = new Subject();

  horizontalLayout: FormLayout = FormLayout.Horizontal;

  tabActiveId: string | number = 'tab1';
  showPassword = false;

  tabItems: any;
  language!: string;
  i18nValues: any;
  toastMessage: any;
  languages = LANGUAGES;
  username: any;
  password: any;
  email:any = null;
  code:any = null;
  pass1:any = null;
  pass2:any = null;

  formData = {
    userAccount: 'Admin',
    userAccountPassword: 'DevUI.admin',
    userEmail: 'admin@devui.com',
    userEmailPassword: 'devuiadmin',
  };

  formRules: { [key: string]: DValidateRules } = {
    // usernameRules: {
    //   validators: [
    //     { required: true },
    //     // { minlength: 4 },
    //     // { maxlength: 20 },
    //     {
    //       pattern: /^[a-zA-Z0-9]+(\s+[a-zA-Z0-9]+)*$/,
    //       message: "le nom d'utilisateur ne pas contenir d'espace",
    //     },
    //   ],
    // },
    // emailRules: {
    //   validators: [{ required: true }, { email: true }],
    //  },
    // passwordRules: {
    //   validators: [{ required: true }, { minlength: 4 }, { maxlength: 15 }, { pattern: /^[a-zA-Z0-9\d@$!%*?&.]+(\s+[a-zA-Z0-9]+)*$/ }],
    //   message: 'Entrez un mot de passe qui a plus de 4',
    // },

  };




  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private translate: TranslateService,
    private i18n: I18nService,
    private personalizeService: PersonalizeService,
    private changeDetector: ChangeDetectorRef,
    private listDataService: ListDataService,
  ) {
    //this.language = this.translate.currentLang;
  }
  //changeView
  forgetpass:boolean = true;
  verificatemail:boolean = false;
  verificatecode:boolean = false;
  message:string = "";
  createdCode = 0;
  IDuser:any = null;
  VerificateMail(){
    this.message = "  ";
    if(this.email == null){
      this.message = "Veuillez saisir votre email";
    }else{
      this.createdCode = Math.floor((10000 * Math.random()+( Math.random()+ Math.random())));
      if(this.createdCode.toString().length<4||this.createdCode.toString().length>4){
        this.createdCode = Math.floor((10* Math.random()+( Math.random()+ Math.random()))*1000);
      }
      var data = {
        "usermail":this.email,
        "code":this.createdCode
      }
      var datav = {
        "email":this.email,
      }
      this.listDataService.addData("verifuser.php","users",datav).subscribe((d:any) => {
        // console.log(d);
        if(d.response.statutCode == 200){
          this.IDuser = d.response.data.id;
          this.message = "  ";
          this.listDataService.addData("sendmail.php","email",data).subscribe((datas:any) =>{
          if(datas.response.statutCode ==200){
          this.message = "  ";
            this.verificatemail=true
          }
       })
        }else{
          this.message = "L'utilisateur n'existe pas";
        }
      })
    }
  }

  VerificateCode(){
    this.message = "  ";
    if(this.code ==null||this.code==""){
      this.message = "Veuillez saisir le code reçu par email";
    }else{
      if(this.createdCode == this.code){
        this.message = "  ";
        this.verificatecode = true;
        this.verificatemail=false
      }else{
        this.message = "le code est invalide";
      }
    }
  }
  VerificatePasse(){
    this.message = "  ";
    if((this.pass1 ==null||this.pass2 ==null)||(this.pass1 ==null&&this.pass2 ==null)){
      this.message = "Veuillez saisir votre nouveau mot de passe";
    }else if(this.pass1 !== this.pass2){
      this.message = "Les mots de passe ne sont pas identique";
    }else if(this.pass1 == this.pass2){
      this.message = "  ";
      var data = {
        "iduser":this.IDuser,
        "pass":this.pass1
      }
      this.listDataService.addData("updateuserpass.php","users",data).subscribe((datas:any)=>{
        if(datas.response.statutCode  ==200){
          this.message = "  ";
          this.router.navigateByUrl('/login')
        }
      });
    }
  }

  Retour(){
    this.message = "  ";
    this.forgetpass=true
    this.verificatemail=false
    this.verificatecode=false
  }
  RetourLogin(){
    this.router.navigateByUrl('/login')
  }
  ngOnInit(): void {
    this.forgetpass = true;
    this.changeDetector.detectChanges()
  }



}
