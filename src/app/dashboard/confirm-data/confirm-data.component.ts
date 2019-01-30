/**
 * Copyright (c) iEXBase. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component, Input, OnInit } from '@angular/core';

// Services
import { TronWebService } from '../../services/tronweb.service';

@Component({
    selector: 'app-confirm-data',
    templateUrl: './confirm-data.component.html',
    styleUrls: ['./confirm-data.component.scss']
})
export class ConfirmDataComponent implements OnInit {

    /**
     * Get the sender's address
     *
     * @var string
     */
    @Input()
    fromAddress: string;

    /**
     * Get an array of addresses
     *
     * @var string
     */
    addresses: any;

    /**
     * Hide and show address list
     *
     * @var boolean
     */
    isToggle = false;

    /**
     * Get your balance
     *
     * @var number
     */
    yourBalance: number = <number> 0;

    /**
     * Object creation ConfirmDataComponent
     *
     * @param {TronWebService} tronWebService - TronWeb service
     */
    constructor(
        public tronWebService: TronWebService
    ) {
        //
    }

    /**
     * We start object life cycle
     *
     * @return void
     */
    ngOnInit(): void {
        this.addresses = this.tronWebService.listAddresses;
        this.tronWebService.getBalance().then(balance => {
            this.yourBalance = balance;
        });
    }

    /**
     * Hide and show address list
     *
     * @returns {boolean}
     */
    toggle(): boolean {
        return this.isToggle = !this.isToggle;
    }
}
