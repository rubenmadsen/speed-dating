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
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
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
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
