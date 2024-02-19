import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserModel} from "../../models/userModel";
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit, OnDestroy{
  user!:UserModel;
  private sub: any

  constructor(private route : ActivatedRoute) {}

  ngOnInit(){

    this.sub = this.route.queryParams.subscribe(params =>{
      this.user= params as UserModel;
      console.log(this.user.city)
      console.log(this.user.email)
      console.log(this.user.imagePath)
    });
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }
}
