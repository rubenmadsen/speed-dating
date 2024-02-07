import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomepageComponent} from "./pages/homepage/homepage.component";
import {EventPageComponent} from "./pages/event-page/event-page.component";

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'event', component: EventPageComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


