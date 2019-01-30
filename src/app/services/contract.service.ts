import { Injectable } from '@angular/core';
import { BigNumber } from 'bignumber.js';
import { NGXLogger } from 'ngx-logger';

import * as _ from 'lodash';
import iEXMultiSenderABI from '../abi/iEXMultiSender.json';

// config
import { environment } from '../../environments/environment';

// Services
import { TronWebService } from './tronweb.service';

@Injectable()
export class ContractService {

    /**
     * Transaction list
     *
     * @var any[]
     */
    txs: any[] = [];

    /**
     * Transaction Index
     *
     * @var any
     */
    txHashToIndex: any = {};

    /**
     * Basic methods of 'tronWeb'
     *
     * @var any
     */
    tronWeb: any;

    /**
     * Object creation ContractService
     *
     * @param {NGXLogger} logger - Logger service
     * @param {TronWebService} tronWebService - TronWeb service
     */
    constructor(
        private logger: NGXLogger,
        private tronWebService: TronWebService
    ) {
        this.logger.info('ContractService initialized');
    }

    /**
     * We start the sending process
     *
     * @returns {Promise}
     */
    async doSend(): Promise<any> {
        this.txs = [];
        this.logger.info('Started tx...');

        // We wait a few seconds and start
        setTimeout(() => {
            this.multiSend(
                this.tronWebService.totalNumberTx,
                this.tronWebService.arrayLimit
            ).then(() => {});
        }, 2000);
    }

    /**
     * Transaction processor
     *
     * @param {number} slice - Total number
     * @param {number} addPerTx - Array limit
     *
     * @returns {Promise}
     */
    async multiSend(slice: number, addPerTx: number): Promise<any> {
        let { addressToSender, balanceToSender, txFee } =  this.tronWebService;
        this.tronWeb = TronWebService.getTronWeb;

        const start = (slice - 1) * addPerTx;
        const end = slice * addPerTx;

        addressToSender = addressToSender.slice(start, end);
        balanceToSender = balanceToSender.slice(start, end);

        let trxValue;
        const totalInSun = balanceToSender.reduce((total, num) => {
            return (new BigNumber(total).plus(new BigNumber(num)));
        });
        const totalInTrx = this.tronWebService.fromSun(
            totalInSun.toString()
        );
        trxValue = new BigNumber(txFee).plus(totalInTrx);
        this.logger.info('slice',
            slice,
            addressToSender[0],
            balanceToSender[0],
            addPerTx
        );

        // We open a contract
        const multiSender = await this.tronWeb.contract(iEXMultiSenderABI)
            .at(environment.contractAddress);

        // We send
        await multiSender.multisend(
            addressToSender,
            balanceToSender
        ).send({
            callValue: this.tronWebService.toSun(trxValue)
        }).then(hash => {
            this.txHashToIndex[hash] = this.txs.length;
            this.txs.push({
                status: 'pending',
                text: `Successfully sent ${trxValue} TRX`,
                hash
            });
            // Getting transaction status
            this.getTxStatus(hash);
        }).catch(err => {
            this.logger.error(err);
        });

        slice--;
        if (slice > 0) {
            this.multiSend(slice, addPerTx).then(() => {});
        }
    }

    /**
     * Getting transaction status
     *
     * @param {string} hash - Transaction hash
     * @returns {Promise}
     */
    async getTxStatus(hash: string): Promise<any> {
        this.logger.info('Get tx status', hash);
        // Request for details
        setTimeout(() => {
            const tronWeb = TronWebService.getTronWeb;
            // Get transaction details
            tronWeb.trx.getTransaction(hash, (error, res) => {
                // If transactions are displayed in unconfirmed
                if (_.isArray(res.ret)) {
                    if (res.ret[0]['contractRet'] == 'SUCCESS') {
                        const index = this.txHashToIndex[hash];
                        this.txs[index].status = `confirmed`;
                    } else {
                        const index = this.txHashToIndex[hash];
                        this.txs[index].status = `error`;
                        this.txs[index].name = `Transaction rejected by network`;
                    }
                } else {
                    this.getTxStatus(hash);
                }
            });
        }, 3000);
    }
}
