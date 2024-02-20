import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserModel} from "../../models/userModel";
import { ActivatedRoute } from '@angular/router'
import {BackendService} from "../../services/backend.service";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit, OnDestroy{


  private sub: any

  constructor(private route : ActivatedRoute, private backendService: BackendService) {}

  async ngOnInit(){
    // this.sub = this.route.queryParams.subscribe(params =>{
    //   this.user= params as UserModel;
    //   // console.log(this.user.city)
    //   // console.log(this.user.email)
    //   // console.log(this.user.imagePath)
    // });
    await this.backendService.getMe().subscribe({
      next: (response) => {
        this.user = response.user
        console.log(this.user)
      }, error: (error) => {
        console.log(error)
      }
    });
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

}
