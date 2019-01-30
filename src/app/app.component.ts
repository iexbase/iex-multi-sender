/**
 * Copyright (c) iEXBase. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component, OnInit } from '@angular/core';

import { NGXLogger } from 'ngx-logger';

// Config
import { environment } from '../environments/environment';

// Services
import { LanguageService } from './services/language.service';
import { TronWebService } from './services/tronweb.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    /**
     * Object creation AppComponent
     *
     * @param {LanguageService} languageService - Language service
     * @param {TronWebService} tronWebService - TronWeb Service
     * @param {NGXLogger} logger - Log service
     */
    constructor(
        private languageService: LanguageService,
        private tronWebService: TronWebService,
        private logger: NGXLogger
    ) {
        //
    }

    /**
     * We start object life cycle
     *
     * @return void
     */
    ngOnInit(): void {
        this.onPlatformReady()
            .then(() => {});
    }

    /**
     * Loading and reading data
     *
     * @return void
     */
    private async onPlatformReady() {
        await this.languageService.load();
        this.registerTronWeb();
    }

    /**
     * We register the service TronWeb
     *
     * @return void
     */
    protected registerTronWeb(): void {
        window.addEventListener('load', () => {
            this.tronWebService.initTronWeb()
                .then(() => {
                    this.logger.info(environment.appName + ' Successfully launched');
                })
                .catch(() => {
                    this.logger.error('Could not initialize the app');
                });
        });
    }
}
