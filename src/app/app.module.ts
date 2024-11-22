import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MenuComponent} from './menu/menu.component';
import {ServerCheckService} from './service/servercheck-service';
import {AppRoutingModule} from './app.routing.module';
import {LoginComponent} from './login/login.component';
import {LoginService} from './service/login.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthenticatedGuard} from './guard/authenticated.guard';
import {MembersComponent} from './members/members.component';
import {MembersService} from './service/members.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MainInterceptor} from './util/main.interceptor';
import {ReportMembershipComponent} from './report/report-membership.component';
import {ReportComponent} from './report/report.component';
import {MemberFormComponent} from './members/member-form.component';
import {PaymentsComponent} from './payments/payments.component';
import {PaymentFormComponent} from './payments/form/payment-form.component';
import {PaymentService} from './service/payment.service';
import {PaginationComponent} from './pagination/pagination.component';
import {YearPaginationComponent} from './pagination/year-pagination.component';
import {PositivePipe} from './pipes/positive.pipe';
import {EventsComponent} from './events/events.component';
import {EventFormComponent} from './events/form/event-form.component';
import {EventsService} from './service/events.service';
import {EventTypePipe} from './pipes/eventtype.pipe';
import {EventParticipationComponent} from './events/form/event-participation.component';
import {AppDataService} from './service/app-data.service';
import {UserDataService} from './service/user-data.service';
import {BalanceService} from './service/balance.service';
import {MemberStatusPipe} from './pipes/memberstatus.pipe';
import {DateFormatValidatorDirective} from './directives/invalid-date.directive';
import {MembershipService} from './service/membership.service';
import {PaymentDataHolder} from './payments/payment-data-holder';
import {TitleService} from './service/title.service';
import {EventDataHolder} from './events/event-data-holder';
import {ReportService} from './service/report.service';
import {EventReportTableComponent} from './report/event-report-table.component';
import {UsersComponent} from './users/users.component';
import {AdminAuthenticatedGuard} from './guard/admin-authenticated.guard';
import {UserService} from './service/user.service';
import {SettingsComponent} from './settings/settings.component';
import {ProductsComponent} from './products/products.component';
import {ProductsFormComponent} from './products/products-form.component';
import {ProductService} from './service/product.service';
import {ExportService} from './service/export.service';
import {StatisticsComponent} from './statistics/statistics.component';
import {StatisticsService} from './service/statistics.service';
import {TrainingStatisticsComponent} from './statistics/training-statistics.component';
import {MemberStatisticsComponent} from './statistics/member-statistics.component';
import {StartComponent} from './start/start.component';
import {MinimizeTextPipe} from './pipes/minimize.pipe';
import {PercentagePipe} from './pipes/percentage';
import {ClipboardModule} from 'ngx-clipboard';
import {EventComponent} from './events/event.component';
import {ShortEventNamePipe} from './pipes/short-event-name';
import {ProductComponent} from './products/product.component';
import {PaymentActionsComponent} from './payments/actions/payment-actions.component';
import {PhoneValidatorDirective} from './directives/invalid-phone.directive';
import {TotalStatisticsComponent} from './members/total-statistics/total-statistics.component';
import { MonthlyStatisticsComponent } from './statistics/monthly-statistics/monthly-statistics.component';
import {ChartModule} from 'angular-highcharts';
import {AdminFormComponent} from './admin/admin-form/admin-form.component';
import {RefractionService} from './service/refraction.service';
import {RefractionsComponent} from './refractions/refractions.component';
import {RefractionDetailsComponent} from './refractions/details/refraction-details.component';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    MenuComponent,
    LoginComponent,
    MembersComponent, MemberFormComponent, TotalStatisticsComponent,
    ReportMembershipComponent, ReportComponent,
    PaymentsComponent, PaymentFormComponent,
    EventsComponent, EventFormComponent, EventParticipationComponent,
    PaginationComponent, YearPaginationComponent,
    PositivePipe, EventTypePipe, MemberStatusPipe, MinimizeTextPipe, PercentagePipe, ShortEventNamePipe,
    DateFormatValidatorDirective, PhoneValidatorDirective,
    EventReportTableComponent,
    UsersComponent,
    RefractionsComponent, RefractionDetailsComponent,
    SettingsComponent,
    ProductsComponent,
    ProductsFormComponent,
    StatisticsComponent, TrainingStatisticsComponent, MemberStatisticsComponent, EventComponent,
    ProductComponent, PaymentActionsComponent, MonthlyStatisticsComponent,
    AdminFormComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, ReactiveFormsModule, ClipboardModule, ChartModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: MainInterceptor,
    multi: true,
  },
    AppDataService, UserDataService, PaymentDataHolder, TitleService, EventDataHolder,
    AuthenticatedGuard, AdminAuthenticatedGuard,
    ServerCheckService,
    LoginService,
    MembersService,
    PaymentService,
    EventsService,
    BalanceService,
    MembershipService,
    ReportService,
    UserService,
    ProductService,
    ExportService,
    StatisticsService,
    RefractionService,
    PercentagePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
