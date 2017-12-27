import { Component } from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html'
})
export class AboutComponent {

  constructor(public toast: ToastComponent) { }

}
