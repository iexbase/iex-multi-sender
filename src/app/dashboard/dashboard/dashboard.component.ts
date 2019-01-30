/**
 * Copyright (c) iEXBase. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

// Utils
import { JsonValidator } from '../../utils/jsonValidator';

// Services
import { TronWebService } from '../../services/tronweb.service';


@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    /**
     * Go to confirmation step
     *
     * @var boolean
     */
    isNext = false;

    /**
     * Go to send step
     *
     * @var boolean
     */
    runProcess = false;

    /**
     * Get total balance
     *
     * @var number
     */
    totalBalance: number;

    /**
     * List addresses
     *
     * @var any[]
     */
    listAddresses: any[] = [];

    /**
     * Send Fields
     *
     * @var FormGroup
     */
    public senderForm: FormGroup;

    /**
     * Loading page
     *
     * @var boolean
     */
    isLoading: boolean = false;

    /**
     * Object creation DashboardComponent
     *
     * @param {FormBuilder} fb - FormBuilder service.
     * @param {TronWebService} tronWebService - TronWeb service
     * @param {MatSnackBar} snackBar - Service to dispatch Material Design snack bar messages.
     * @param {TranslateService} translate - Translate service
     */
    constructor(
        private fb: FormBuilder,
        private tronWebService: TronWebService,
        private snackBar: MatSnackBar,
        private translate: TranslateService
    ) {
        this.senderForm = this.fb.group({
            address: [null, Validators.compose([
                Validators.required
            ])],
            addressesList: [null, Validators.compose([
                Validators.required,
                new JsonValidator().isValid
            ])],
        });
    }

    /**
     * We start object life cycle
     *
     * @return void
     */
    ngOnInit() {
        this.isLoading = true;
        // We are waiting for a couple of seconds and load
        setTimeout(() => {
            this.isLoading = false;
        }, 1000);
    }

    /**
     * Data confirmation
     *
     * @return void
     */
    confirmData(): void {
        this.tronWebService.parseAddresses(
            this.senderForm.controls['addressesList'].value
        ).then((addresses: any[]) => {

            this.listAddresses = addresses;
            this.totalBalance = this.tronWebService.totalBalance;

            // If no addresses found
            if (this.listAddresses && this.listAddresses.length == 0) {
                return this.snackBar.open('No addresses found', null, {
                    duration: 2000
                });
            }

            this.tronWebService.initContractDetails().then(() => {});
            // If duplicates are found, show notification.
            if (this.tronWebService.duplicate.length > 0) {
                this.snackBar.open(this.translate.instant('DuplicateAddresses'), null, {
                    duration: 2000
                });
            }
            this.isNext = true;
        });
    }
}
