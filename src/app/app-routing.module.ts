/**
 * Copyright (c) iEXBase. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardModule } from './dashboard/dashboard.module';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { LayoutComponent } from './shared/layouts/layout.component';

const routes: Routes = [{
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', pathMatch: 'full', component: DashboardComponent }
        ]
    }
];

@NgModule({
  imports: [
      DashboardModule,
      RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
