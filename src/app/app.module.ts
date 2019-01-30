/**
 * Copyright (c) iEXBase. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxWebstorageModule } from 'ngx-webstorage';

import {HttpClient, HttpClientModule } from '@angular/common/http';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { SharedModule } from './shared/shared.module';

// Services
import { ContractService } from './services/contract.service';
import { LanguageService } from './services/language.service';
import { TronWebService } from './services/tronweb.service';


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgxWebstorageModule.forRoot(),
        HttpClientModule,
        LoggerModule.forRoot({
                level:
                    NgxLoggerLevel.INFO ||
                    NgxLoggerLevel.DEBUG
            }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        SharedModule,
        AppRoutingModule
    ],
    providers: [
        TronWebService,
        ContractService,
        LanguageService,
        DecimalPipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer
    ) {
        this.matIconRegistry.addSvgIcon(
            'github-icon',
            this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/github.svg')
        );

        this.matIconRegistry.addSvgIcon(
            'telegram-icon',
            this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/telegram.svg')
        );
    }
}
