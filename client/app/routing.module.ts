import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account/account.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
import { GreenHouseTypeComponent } from './greenhousetype/greenHouseType.component';
import { GreenHouseComponent } from './greenhouse/greenHouse.component';
import { ActivitiesComponent } from './activities/activities.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { MessageComponent } from './message/message.component';

const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuardLogin] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuardAdmin] },
  { path: 'greenHouseType', component: GreenHouseTypeComponent },
  { path: 'greenHouse', component: GreenHouseComponent }, 
  { path: 'activities', component: ActivitiesComponent }, 
  { path: 'feedback', component: FeedbackComponent }, 
  { path: 'message', component: MessageComponent }, 
  { path: 'notfound', component: NotFoundComponent },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class RoutingModule {}
