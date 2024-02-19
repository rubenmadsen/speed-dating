import { Component } from '@angular/core';
import {BackendService} from "../../services/backend.service";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent {



  constructor(private backendService: BackendService) {

  }

  ngOnInit(){
    console.log("hjer");
    this.backendService.getMe().subscribe({
      next: (response) => {
        console.log(response)
    }, error: (error) => {
        console.log(error)
      }
    });

  }

}
