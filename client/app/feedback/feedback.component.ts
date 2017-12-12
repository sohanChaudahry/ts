import { Component, OnInit } from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  constructor(public toast: ToastComponent,
           private feedbackService:FeedbackService) { }

  ngOnInit() {
    this.getFeedback();
  }

  feedBackList=[];

  getFeedback() {
    this.feedbackService.getFeedbackApi().subscribe(
      data =>{ 
        this.feedBackList = data.responseData
      },
      error => console.log(error),
    );
  }
}
