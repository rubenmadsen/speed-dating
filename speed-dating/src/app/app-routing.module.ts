import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomepageComponent} from "./pages/homepage/homepage.component";
import {EventPageComponent} from "./pages/event-page/event-page.component";
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import {OverviewPageComponent} from "./pages/overview-page/overview-page.component";

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'event', component: EventPageComponent },
  { path: 'profile', component: ProfilePageComponent },
  {path: 'overview', component: OverviewPageComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }


