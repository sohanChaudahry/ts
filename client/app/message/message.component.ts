import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  constructor(private messageSErvice : MessageService,
  public toast: ToastComponent) { }

  ngOnInit() {
    this.getMessage();
  }

  messageList=[];

  getMessage() {
    this.messageSErvice.getMessageApi().subscribe(
      data =>{ 
        this.messageList = data.responseData
      },
      error => console.log(error),
    );
  }
}
