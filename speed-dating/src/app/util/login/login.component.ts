import {Component} from '@angular/core';
import {faX} from "@fortawesome/free-solid-svg-icons/faX";
import {BackendService} from "../../services/backend.service";
import {StatusMessage} from "../../interfaces/statusMessage";
import {GlobalService} from "../../services/global.service";
import {StatusMessageType} from "../../interfaces/StatusMessageType";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  protected readonly faX = faX;
  isVisible: boolean = true;
  errorMessage: string = '';
  form: any = {
    email: '',
    password: ''
  };

  constructor(private router:Router, private backend: BackendService, private globalService:GlobalService) {}

  private validateFields():boolean{
    if (this.form.email.length === 0 || this.form.password === 0){
      this.globalService.setGlobalStatus({message:"You need to fill out all fields", type:StatusMessageType.WARNING})
      return false;
    }
    return true
  }
  /**
   * Method to login, currently just reloads the root page with the cookie.
   */
  login() {
    if(!this.validateFields())
      return;
    this.backend.login(this.form.email, this.form.password).subscribe({
      next: (response) => {
        this.isVisible = false;
        const mess:StatusMessage = {
          message:"You are logged in!",
          type:StatusMessageType.SUCCESS
        };
        this.globalService.setGlobalStatus(mess);
        setTimeout(() => this.router.navigate(['event']),500);
        ;
      },
      error: (error) => {
        this.errorMessage = 'Login failed. Please try again.';
        const mess:StatusMessage = {} as StatusMessage;
        mess.message = "Login failed";
        mess.type = StatusMessageType.ALERT;
        this.globalService.setGlobalStatus(mess);
      }
    });
  }
  closeForm() {
    this.isVisible = false; // Set the visibility flag to false
  }
}

