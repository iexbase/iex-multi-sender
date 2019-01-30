/**
 * Copyright (c) iEXBase. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { environment } from '../../../../environments/environment';

// Components
import {delay} from 'rxjs/operators';
// Services
import { TronWebService } from '../../../services/tronweb.service';
import { StatusProComponent } from '../status-pro/status-pro.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    /**
     * App project name
     *
     * @var string
     */
    appName = environment.appName;

    /**
     * Github link
     *
     * @var string
     */
    githubLink = environment.gitHub;

    /**
     * Contract address
     *
     * @var string
     */
    contractAddress = environment.contractBase58;

    /**
     * Check the status of PRO
     *
     * @var boolean
     */
    isPro:  BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    isLoading = true;

    /**
     * Object creation HeaderComponent
     *
     * @param {MatDialog} dialog - Service can be used to open modal dialogs
     * @param {TronWebService} tronWebService - TronWeb service
     */
    constructor(
        private dialog: MatDialog,
        public tronWebService: TronWebService
    ) {
    }

    /**
     * We start object life cycle
     *
     * @return void
     */
    async ngOnInit() {
        const timer = setInterval(() => {
            if (this.tronWebService.loggedIn.getValue()) {
                this.isPro = this.tronWebService.addressIsPro;
                clearInterval(timer);
                this.isLoading = false;
            }
        }, 1000);
    }

    /**
     * Open the modal window to get the status PRO
     *
     * @return void
     */
    getProModal(): void {
        this.dialog.open(StatusProComponent, {
            width: '450px',
            data: {}
        });
    }
}
