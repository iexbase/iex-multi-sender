/**
 * Copyright (c) iEXBase. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {BehaviorSubject, Observable} from 'rxjs';


// Components
// Services
import { TronWebService } from '../../../services/tronweb.service';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'app-status-pro',
    templateUrl: './status-pro.component.html',
    styleUrls: ['./status-pro.component.scss'],
})
export class StatusProComponent implements OnInit {
    /**
     * The amount to receive the status of PRO
     *
     * @var number
     */
    amount = 0;


    isPro = false;

    /**
     * Authorization status TRONLink
     *
     * @var BehaviorSubject
     */
    isLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /**
     * Object creation StatusProComponent
     *
     * @param {MatDialog} dialogRef - Reference to a dialog opened via the MatDialog service.
     * @param {TronWebService} tronWebService - TronWeb service
     */
    constructor(
        public dialogRef: MatDialogRef<HeaderComponent>,
        private tronWebService: TronWebService
    ) {
        //
    }

    /**
     * We start object life cycle
     *
     * @return void
     */
    ngOnInit(): void {
        this.isLogin = this.tronWebService.loggedIn;

        if ((this.isLogin.getValue())) {
            this.tronWebService.getFeePro().then(result => {
                this.amount = result;
            });
            this.tronWebService.isPro().then(result => {
                this.isPro = result;
            });
        }
    }

    /**
     * We register the status of PRO
     *
     * @return void
     */
    registerPro(): void {
        this.tronWebService.registerPro(this.amount).then(() => {});
        this.onClose();
    }

    /**
     * Close modal
     *
     * @return void
     */
    onClose() {
        this.dialogRef.close();
    }
}
