import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  rolesForm: FormGroup;
  username = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(30),
    Validators.pattern('[a-zA-Z0-9_-\\s]*')
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100)
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);
  phone = new FormControl('', [
    Validators.required,
    Validators.minLength(10)
  ]);
 
  
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              public toast: ToastComponent,
              private userService: UserService) { }

  ngOnInit() {
     

    this.registerForm = this.formBuilder.group({
      username: this.username,
      email: this.email,
      password: this.password,
      phone:this.phone,
       role: new FormGroup({
        type: new FormControl('', [Validators.required])
      })
       
      });
  }

  setClassUsername() {
    return { 'has-danger': !this.username.pristine && !this.username.valid };
  }
  setClassEmail() {
    return { 'has-danger': !this.email.pristine && !this.email.valid };
  }
  setClassPassword() {
    return { 'has-danger': !this.password.pristine && !this.password.valid };
  }
  setClassPhone() {
    return { 'has-danger': !this.phone.pristine && !this.phone.valid };
  }

  register() {
      this.registerForm.value.phone="91-"+this.registerForm.value.phone;
      this.userService.register({reqData:this.registerForm.value}).subscribe(
        res => {
          if(res.responseData && !res.errors){
              this.toast.setMessage('you successfully registered!', 'success');
              this.router.navigate(['/login']);
          }else if(res.errors.length!=0){
              this.toast.setMessage(res.errors[0].message, 'danger');
          }
        },
        error => this.toast.setMessage('email already exists', 'danger')
      );
  }
}
