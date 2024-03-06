import {Component, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {faGripVertical} from "@fortawesome/free-solid-svg-icons/faGripVertical";
import {BehaviorSubject, delay, Observable, Subscription, takeWhile} from "rxjs";
import {EventService} from "../../services/event.service";
import {EventModel} from "../../models/eventModel";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UserModel} from "../../models/userModel";
import {BackendService} from "../../services/backend.service";
import {DateModel} from "../../models/dateModel";
import {ParticipantListComponent} from '../../event/participant-list/participant-list.component';
import {DateContainerComponent} from '../../event/date-container/date-container.component';
import {EventStateService} from "../../services/event-state.service";
import {StatusMessage} from "../../interfaces/statusMessage";
import {StatusMessageType} from "../../interfaces/StatusMessageType";
import {GlobalService} from "../../services/global.service";

import {Location} from '@angular/common';
import {DateReviewComponent} from "../../event/date-review/date-review.component";
import {DateFeedbackModel} from "../../models/dateFeedbackModel";

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit, OnDestroy {

  protected readonly faGripVertical = faGripVertical;
  event!: EventModel;
  @ViewChild(ParticipantListComponent) childParticipantList!: ParticipantListComponent;
  @ViewChild(DateReviewComponent) childDateReview!: DateReviewComponent;

  subscription!: Subscription;
  participantsList?: UserModel[];
  datesList: DateModel[] = [];

  protected dateNow: Date = new Date();

  continueIsPressed: boolean = false;

  me!: UserModel;
  isRegisted: Boolean = false;
  hasAutoMatched = false;
  removedIsPressed = false;

  allowedToRegister = true;

  cancelEventButtonClass: string = 'trans clr-accent border-accent';
  clearTablesButtonClass: string = 'trans clr-accent border-accent disabled';
  automaticMatchingButtonClass: string = 'accent border-accent clr-white disabled';
  startDateButtonClass: string = 'accent border-accent clr-white disabled';

  isLoading: Boolean = false;
  isOnGoing: boolean = false;

  isOrganizer$: Observable<boolean> | undefined;

  randomTableNumbers: number[] = [];

  isCreator$: Boolean = false;

  hasGoneOnDate: boolean = false;

  constructor(private eventService: EventService, private authService: AuthService,
              private backend: BackendService,
              private eventStateService: EventStateService,
              private globalService: GlobalService,
              private router: Router,
              private _location: Location) { }

  backClicked() {
    this._location.back();
  }
  /**
   * Load an event
   */
   async ngOnInit() {
    this.eventStateService.clearDates();
    this.subscribeToDates()
    this.subscription = this.eventService.currentEvent.subscribe(event => {
      this.event = event!;
    });


    this.isOrganizer$ = this.authService.isOrganizer;
    this.participantsList = this.event?.participants;

    this.createEmptyDates();
    this.checkUserRegistration();

    const baseClass = 'trans clr-accent border-accent';
    const disabledClass = ' disabled';
    const accentClass = 'accent border-accent clr-white';

    if(this.participantsList && this.participantsList.length == this.event?.totalParticipants) {
      this.clearTablesButtonClass = baseClass;
      this.automaticMatchingButtonClass = accentClass;
      this.startDateButtonClass = accentClass;
    } else {
      this.clearTablesButtonClass = baseClass + disabledClass;
      this.automaticMatchingButtonClass = accentClass + disabledClass;
      this.startDateButtonClass = accentClass + disabledClass;
    }
    this.isOnGoing = this.dateNow >= new Date(this.event.startDate) && !this.event.hasEnded;
    await this.getSpecifivEvent();
   }
   async getSpecifivEvent(){
    this.backend.getSpecificEvent(this.event).subscribe( {
      next: (response) => {
        this.event = response
        console.log(this.event)
        this.eventService.changeEvent(this.event);
      }
    })
  }

  goOnDate(){
     this.hasGoneOnDate = !this.hasGoneOnDate;
  }

  continue(answer: any){

    const feedbackToUpdate = this.currentDate.personTwo?._id === this.me._id ? 'feedbackTwo' : 'feedbackOne';
    const feedbackId = this.currentDate[feedbackToUpdate]?._id;

    if (!feedbackId) {
      console.error('Feedback ID not found');
      return;
    }
    const feedbackData = {
      author: this.me,
      question: [answer.q1, answer.q3, answer.q4]
    };

    this.backend.updateFeedback(feedbackId, feedbackData).subscribe({
      next: (response) => {
        const dateIndex = this.event.dates.findIndex(date => date._id === this.currentDate._id);
        if (dateIndex !== -1) {
          if(this.currentDate.personTwo?._id === this.me._id) {
            this.event.dates[dateIndex].feedbackTwo = response;
          } else {
            this.event.dates[dateIndex].feedbackOne = response;
          }
        } else {
          console.error('Current date not found');
        }
        },
      error: (error) => {
        console.log(error)
      }
    });


     this.continueIsPressed = !this.continueIsPressed;
  }
  checkUserRegistration(){
    this.backend.getMe().subscribe(r => {
      this.me = r
      this.isCreator$ = true;
      const sameGenderCount = this.event?.participants.filter(participant => participant.gender === this.me.gender).length;
      if (this.event?.participants.some(participant => participant._id === r._id)) {
        this.isRegisted = true;
      } else {
        if(sameGenderCount === this.event.totalParticipants / 2){
          this.allowedToRegister = false;
        }
      }
    });
  }
  currentDate!: DateModel;

  getMyTableNumber(round: number): number {
    for (const date of this.event.dates) {
      if (date.dateRound == round) {
        if (date.personTwo?._id === this.me._id || date.personOne._id === this.me._id) {
          this.currentDate = date;
          return date.tableNumber
        }
      }
    }
    return 1;
  }

   getMyCounterpart(round: number): UserModel | null {
    for (let date of this.event.dates) {
      if (date.dateRound == round) {
        if (date.personTwo?._id === this.me._id) {
          return date.personOne
        } else if (date.personOne._id === this.me._id){
          return  date.personTwo
        }
      }
    }
    return null;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Helper method to generate temporary dates
   */
  createEmptyDates(){
    let i = 1;
    this.participantsList?.forEach(participant => {
      if (participant.gender == 'male'){
        const date : DateModel = {
          event: this.event!,
          tableNumber: i,
          dateRound: 0,
          personOne: participant,
          personTwo: null,
          percentage: 0,
          feedbackOne: null,
          feedbackTwo:null,
        }
        i += 1;
        this.eventStateService.addEvent(date)
      }
    })
  }

  back(){
    this.removedIsPressed = false;
  }

  registerAtEvent() {
     if(this.event == null){
       return
     }
    this.backend.joinEvent(this.event).subscribe(r => {
      this.eventService.changeEvent(r)
      this.isLoading = true;
    });

    this.sleep(1000).then(() => {
      this.isRegisted = true;
      this.isLoading = false;
    })
  }

  async sleep(ms: number): Promise<void> {
    return new Promise(
      (resolve) => setTimeout(resolve, ms));
  }

  unregister() {
    if(this.event == null){
      return
    }
    this.backend.leaveEvent(this.event).subscribe(r => {
      this.eventService.changeEvent(r)
      this.isLoading = true;
    })
    this.sleep(1000).then(() => {
      this.isRegisted = false;
      this.isLoading = false;
    })
  }


  startDates() {
     if(!this.checkDates()){
       const mess: StatusMessage = {
         message: "Please match all participants",
         type: StatusMessageType.ALERT,
       };
       this.globalService.setGlobalStatus(mess);
       return
     }
     this.backend.setDatesForRound(this.event!, this.datesList).subscribe({
        next: async (response) => {
          const mess: StatusMessage = {
            message: "Dates running....",
            type: StatusMessageType.SUCCESS,
            ms: 3000
          };
          this.globalService.setGlobalStatus(mess);
          await this.sleep(3000);
          this.event = response;
          this.eventService.changeEvent(this.event);
          this.clearTables();
          this.eventStateService.clearDates();
          this.createEmptyDates()
          this.backend.getSimulatedDatesWithFeedback(this.event!).subscribe({
           next: (response) => {
             this.event = response;
           },
           error: (error) => {
             console.log(error);
           }
         })
       },
       error: (error) => {
         console.log(error)
       }
     })
  }


  /**
   * Helper method to check is all dates has both participants
   */
  checkDates(): boolean {
    for (const date of this.datesList) {
      if (date.personTwo === null) {
        return false;
      }
    }
    if(this.event.currentParticipants != this.event.totalParticipants){
      return false
    }
    return true;
  }

  subscribeToDates() {
    this.eventStateService.dates$.subscribe(dates => {
      if(dates.length != 0){
        this.datesList = dates;
      }
    });
  }

  removeEvent(){
    if(!this.removedIsPressed){
      this.removedIsPressed = true;
      return
    }
    this.backend.deleteEvent(this.event!).subscribe({
      next: (response) => {
        const index = this.me.events.findIndex(event => event === this.event);
        if(index !== -1){
          this.me.events.splice(index, 1);
        }
        const loadingMess: StatusMessage = {
          message: "Event removed",
          type: StatusMessageType.SUCCESS,
        };
        this.globalService.setGlobalStatus(loadingMess);
        setTimeout(() => this.router.navigate(['']), 500);
      },
      error: (error) => {
        const loadingMess: StatusMessage = {
          message: "Couldn't remove event",
          type: StatusMessageType.ALERT,
        };
        this.globalService.setGlobalStatus(loadingMess);        }
    })
  }

  /**
   * Method to have the child components re-generate their lists
   */
  clearTables(){
    this.eventStateService.clearDates();
    this.createEmptyDates()
    this.hasAutoMatched = false;
    this.childParticipantList.populateList();
  }


  /**
   * Method to automatically match the dates
   */
  automaticMatching() {
    if(this.participantsList?.length !== this.event?.totalParticipants){
      const loadingMess: StatusMessage = {
        message: "Missing participants, can't automatch",
        type: StatusMessageType.WARNING,
      };
      this.globalService.setGlobalStatus(loadingMess);
      return
    }

    if (!this.hasAutoMatched) {
      const loadingMess: StatusMessage = {
        message: "Automatic matching in progress...",
        type: StatusMessageType.SUCCESS,
        ms: -1,
      };
      this.globalService.setGlobalStatus(loadingMess);
      this.backend.getNextRoundOfDatesForEvent(this.event!).subscribe({
        next: (response) => {
          if(response.length != 0){
            this.childParticipantList.clearList();
            this.eventStateService.updateDates(response)
            this.hasAutoMatched = true;
          }
          const loadingMess: StatusMessage = {
            message: "Automatic matching in progress...",
            type: StatusMessageType.SUCCESS,
            ms: -2,
          };
          this.globalService.setGlobalStatus(loadingMess);
        },
        error: (error) => {
          console.log(error);
        }
      })
    } else {
        const mess: StatusMessage = {
          message: "Automatic matching already done",
          type: StatusMessageType.WARNING
        };
        this.globalService.setGlobalStatus(mess);
    }
  }

  getParticipant(id :string):void{
    this.backend.getSpecificUser(id).subscribe(user => {
      // this.childDateReview.onOpenReview(user);
    });

  }
}
