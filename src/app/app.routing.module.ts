import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LoginComponent} from './login/login.component';
import {MembersComponent} from './members/members.component';
import {AuthenticatedGuard} from './guard/authenticated.guard';
import {PaymentsComponent} from './payments/payments.component';
import {EventsComponent} from './events/events.component';
import {MemberFormComponent} from './members/member-form.component';
import {PaymentFormComponent} from './payments/form/payment-form.component';
import {EventFormComponent} from './events/form/event-form.component';
import {ReportComponent} from './report/report.component';
import {AdminAuthenticatedGuard} from './guard/admin-authenticated.guard';
import {UsersComponent} from './users/users.component';
import {SettingsComponent} from './settings/settings.component';
import {ProductsComponent} from './products/products.component';
import {ProductsFormComponent} from './products/products-form.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {StartComponent} from './start/start.component';
import {TotalStatisticsComponent} from './members/total-statistics/total-statistics.component';
import {AdminFormComponent} from './admin/admin-form/admin-form.component';
import {RefractionsComponent} from './refractions/refractions.component';
import {RefractionDetailsComponent} from './refractions/details/refraction-details.component';

const routes: Routes = [
  {path: '', component: StartComponent},
  {path: 'login', component: LoginComponent},

  {path: 'members', component: MembersComponent, canActivate: [AuthenticatedGuard]},
  {path: 'members/new', component: MemberFormComponent, canActivate: [AuthenticatedGuard]},
  {path: 'members/:id/edit', component: MemberFormComponent, canActivate: [AuthenticatedGuard]},
  {path: 'members/:id/stats', component: TotalStatisticsComponent, canActivate: [AuthenticatedGuard]},

  {path: 'events', component: EventsComponent, canActivate: [AuthenticatedGuard]},
  {path: 'events/new', component: EventFormComponent, canActivate: [AuthenticatedGuard]},
  {path: 'events/:id/edit', component: EventFormComponent, canActivate: [AuthenticatedGuard]},

  {path: 'payments', component: PaymentsComponent, canActivate: [AuthenticatedGuard]},
  {path: 'payments/new', component: PaymentFormComponent, canActivate: [AuthenticatedGuard]},
  {path: 'payments/:id/edit', component: PaymentFormComponent, canActivate: [AuthenticatedGuard]},

  {path: 'products', component: ProductsComponent, canActivate: [AuthenticatedGuard]},
  {path: 'products/new', component: ProductsFormComponent, canActivate: [AuthenticatedGuard]},
  {path: 'products/:id/:mode', component: ProductsFormComponent, canActivate: [AuthenticatedGuard]},

  {path: 'reports', component: ReportComponent, canActivate: [AuthenticatedGuard]},

  {path: 'statistics', component: StatisticsComponent, canActivate: [AuthenticatedGuard]},

  {path: 'settings', component: SettingsComponent, canActivate: [AuthenticatedGuard]},

  {path: 'users', component: UsersComponent, canActivate: [AdminAuthenticatedGuard]},

  {path: 'admin', component: AdminFormComponent, canActivate: [AdminAuthenticatedGuard]},

  {path: 'refractions', component: RefractionsComponent, canActivate: [AuthenticatedGuard]},
  {path: 'refractions/:id/details', component: RefractionDetailsComponent, canActivate: [AuthenticatedGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
