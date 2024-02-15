import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SmileyComponent } from './event/smiley/smiley.component';
import { EventCardComponent } from './event/event-card/event-card.component';
import { EventInfoComponent } from './event/event-info/event-info.component';
import { ParticipantListComponent } from './event/participant-list/participant-list.component';
import { DateContainerComponent } from './event/date-container/date-container.component';
import { RatingFormComponent } from './event/rating-form/rating-form.component';
import { ButtonComponent } from './util/button/button.component';
import { ToggleComponent } from './util/toggle/toggle.component';
import { StatusMessageComponent } from './util/status-message/status-message.component';
import { TagsComponent } from './util/tags/tags.component';
import { MatchPrecentageBarComponent } from './util/match-precentage-bar/match-precentage-bar.component';
import { DateComponent } from './event/date/date.component';
import { ProfileInfoComponent } from './profile/profile-info/profile-info.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { OverviewPageComponent } from './pages/overview-page/overview-page.component';
import { LoginComponent } from './util/login/login.component';
import { SignUpComponent } from './util/sign-up/sign-up.component';
import { CardContainerComponent } from './util/card-container/card-container.component';
import { DateReviewComponent } from './event/date-review/date-review.component';
import { ParticipantAnswerComponent } from './event/participant-answer/participant-answer.component';
import { FilterComponent } from './util/filter/filter.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { CreateEventComponent } from './util/create-event/create-event.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BackendService } from './services/backend.service';
import {HttpClientModule} from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { MinmaxSliderComponent } from './util/minmax-slider/minmax-slider.component';

import { ProfileCardComponent } from './profile/profile-card/profile-card.component';



@NgModule({
  declarations: [
    AppComponent,
    SmileyComponent,
    EventCardComponent,
    EventInfoComponent,
    ParticipantListComponent,
    DateContainerComponent,
    RatingFormComponent,
    ButtonComponent,
    ToggleComponent,
    StatusMessageComponent,
    TagsComponent,
    MatchPrecentageBarComponent,
    DateComponent,
    ProfileInfoComponent,
    EventPageComponent,
    ProfilePageComponent,
    OverviewPageComponent,
    LoginComponent,
    SignUpComponent,
    CardContainerComponent,
    DateReviewComponent,
    ParticipantAnswerComponent,
    FilterComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    CreateEventComponent,
    ProfileCardComponent,
    MinmaxSliderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers: [
    BackendService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
