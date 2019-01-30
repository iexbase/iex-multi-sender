/**
 * Copyright (c) iEXBase. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


import { NgModule } from '@angular/core';
import {
    MatButtonModule, MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatToolbarModule
} from '@angular/material';

import { TranslateModule } from '@ngx-translate/core';

import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgxJsonViewerModule } from 'ngx-json-viewer';

// Components
import { HeaderComponent } from './layouts/header/header.component';
import { LayoutComponent } from './layouts/layout.component';

// Pipes
import { FormatCurrencyPipe } from '../pipes/format-currency.pipe';
import {FromSunPipe} from '../pipes/from-sun.pipe';
import { StatusProComponent } from './layouts/status-pro/status-pro.component';


const sharedModules = [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    NgxJsonViewerModule
];

const sharedMaterialModules = [
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
];

const sharedComponents = [
    LayoutComponent,
    HeaderComponent
];

const sharedDialogs = [
    StatusProComponent
];

const sharedPipes = [
    FormatCurrencyPipe,
    FromSunPipe
];

@NgModule({
    imports: [
        ...sharedModules,
        ...sharedMaterialModules
    ],
    declarations: [
        ...sharedComponents,
        ...sharedDialogs,
        ...sharedPipes
    ],
    exports: [
        ...sharedModules,
        ...sharedMaterialModules,
        ...sharedComponents,
        ...sharedDialogs,
        ...sharedPipes
    ],

    entryComponents: [
        ...sharedDialogs
    ]
})
export class SharedModule { }
