import { NgModule } from '@angular/core';
import {
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule
} from '@angular/material';

// Shared modules
import { SharedModule } from '../shared/shared.module';

// Components
import { ConfirmDataComponent } from './confirm-data/confirm-data.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotAuthorizedComponent } from './dashboard/not-authorized/not-authorized.component';
import { RunProcessComponent } from './run-process/run-process.component';

@NgModule({
    imports: [
        SharedModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSnackBarModule
    ],
    declarations: [
        DashboardComponent,
        ConfirmDataComponent,
        RunProcessComponent,
        NotAuthorizedComponent
    ]
})
export class DashboardModule { }
