import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomepageComponent} from "./pages/homepage/homepage.component";
import {EventPageComponent} from "./pages/event-page/event-page.component";
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import {OverviewPageComponent} from "./pages/overview-page/overview-page.component";
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'event', component: EventPageComponent, canActivate: [AuthGuardService] },
  { path: 'profile', component: ProfilePageComponent, canActivate: [AuthGuardService] },
  { path: 'overview', component: OverviewPageComponent, canActivate: [AuthGuardService] },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }


