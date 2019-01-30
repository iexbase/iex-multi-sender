/**
 * Copyright (c) iEXBase. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Config
import { environment } from '../../../environments/environment';

// Services
import { ContractService } from '../../services/contract.service';
import { TronWebService } from '../../services/tronweb.service';

@Component({
    selector: 'app-run-process',
    templateUrl: './run-process.component.html',
    styleUrls: ['./run-process.component.scss']
})
export class RunProcessComponent implements OnInit {

    /**
     * List Transactions
     *
     * @var BehaviorSubject
     */
    public txHashes: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    /**
     * TX Number
     *
     * @var number
     */
    public numberTx: number;

    /**
     * Blockchain URL
     *
     * @var string
     */
    public blockchainUrl: string  = environment.blockchainUrl;

    /**
     * Count TRON Addresses
     *
     * @var number
     */
    public countAddresses: number = 0;

    /**
     * Object creation RunProcessComponent
     *
     * @param {TronWebService} tronWebService - TronWeb service
     * @param {ContractService} contractService - Contract service
     */
    constructor(
        private tronWebService: TronWebService,
        private contractService: ContractService
    ) {
        //
    }

    /**
     * We start object life cycle
     *
     * @return void
     */
    ngOnInit(): void {
       this.contractService.doSend();
        this.txHashes.next(this.contractService.txs);
        this.countAddresses = this.tronWebService.listAddresses.length || 0;
        this.numberTx = this.tronWebService.totalNumberTx;
    }
}
