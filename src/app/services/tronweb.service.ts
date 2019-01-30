/**
 * Copyright (c) iEXBase. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { EventEmitter, Injectable, NgZone, Output } from '@angular/core';

import { BigNumber } from 'bignumber.js';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';

// Lodash
import * as _ from 'lodash';
// TronWeb
import TronWeb from 'tronweb';
// config
import { environment } from '../../environments/environment';
// Contract JSON
import iEXMultiSenderABI from '../abi/iEXMultiSender.json';


declare let window: any;

@Injectable()
export class TronWebService {

    /**
     * EventEmitter
     *
     * @var EventEmitter
     */
    @Output() update = new EventEmitter();

    /**
     * Basic methods of 'tronWeb'
     *
     * @var any
     */
    private tronWeb: TronWeb | any;

    /**
     * Authorization Status via "TronLink"
     *
     * @var boolean
     */
    public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /**
     * Check account status
     *
     * @var boolean
     */
    public addressIsPro: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /**
     * Get balance from account
     *
     * @var number
     */
    public trxBalance: number = 0;

    /**
     * Address limit
     *
     * @var number
     */
    public arrayLimit: number;

    /**
     * The transfer fee
     *
     * @var number
     */
    public txFee: number;

    /**
     * Total balance of all addresses
     *
     * @var number
     */
    public totalBalance: number;

    /**
     * Address List with balances
     *
     * @var any[]
     */
    public listAddresses: any[] = [];

    /**
     * Address List
     *
     * @var any[]
     */
    public addressToSender: any[] = [];

    /**
     * Balances List
     *
     * @var any[]
     */
    public balanceToSender: any[] = [];

    /**
     * Duplicate Addresses
     *
     * @var any[]
     */
    public duplicate: any[] = [];

    /**
     * Object creation TronWebService
     *
     * @param {NGXLogger} logger - Logger service
     * @param {NgZone} ngZone - Service for executing work inside or outside of the Angular zone.
     */
    constructor(
        private logger: NGXLogger,
        private ngZone: NgZone
    ) {
        this.logger.info('TronWebService initialized');
    }

    /**
     * Get data from TronLink
     *
     * @returns {Promise}
     */
    async initTronWeb() {
        return new Promise(resolve => {

            // Check if the extension is TronLink
            if (typeof window.tronWeb !== 'undefined') {

                if (window.tronWeb && window.tronWeb.ready != undefined) {
                    // Check whether the user is authorized in TronLink
                    this.loggedIn.next(window.tronWeb && window.tronWeb.ready);
                }

                // Use TronLink's provider
                let fullNode = environment.fullNode;
                let solidityNode = environment.solidityNode;

                // If authorized, switch nodes
                if (this.loggedIn) {
                    fullNode = window.tronWeb.currentProviders().fullNode.host;
                    solidityNode = window.tronWeb.currentProviders().solidityNode.host;

                    this.logger.debug('The application is successfully synchronized with TronLink');
                }

                this.tronWeb = new TronWeb(
                    fullNode,
                    solidityNode
                );

                // commit changes to the address from "TronLink"
                window.tronWeb.on('addressChanged', () => {
                    this.ngZone.run( () => {
                        this.getBalance().then(() => {});
                        this.isPro().then(() => {});

                        this.logger.info('Address changed to ' + this.getAddress);
                    });
                });

                // We request the details of the address,
                // a few seconds after launch
                setTimeout(() => {
                    this.getBalance().then(() => {});
                    this.isPro().then(() => {});
                }, 2000);

                return resolve();
            } else {
                this.logger.debug('No tronWeb? You should consider trying TronLink!');
                // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
                window.tronWeb = new TronWeb(
                    environment.fullNode,
                    environment.solidityNode
                );

                return resolve();
            }
        });
    }

    /**
     * Get address
     *
     * @returns {string}
     */
    get getAddress(): string {
        return window.tronWeb.defaultAddress.base58 || undefined;
    }

    /**
     * Receiving value status PRO
     *
     * @returns {Promise}
     */
    async getFeePro(): Promise<number> {
        try {
            const multiSender = await window.tronWeb.contract(iEXMultiSenderABI)
                .at(environment.contractAddress);

            const pro = await multiSender.proFee().call();
            return Number(new BigNumber(pro).toString());
        } catch (e) {
            this.logger.error(e);
        }
    }

    /**
     * Register pro status
     *
     * @param {number} trx - TRX Amount
     * @returns {Promise}
     */
    async registerPro(trx: number): Promise<any> {
        try {
            const multiSender = await window.tronWeb.contract(iEXMultiSenderABI)
                .at(environment.contractAddress);

            await multiSender.registerPro().send({
                callValue: this.toSun(trx)
            });
        } catch (e) {
            this.logger.error(e);
        }
    }

    /**
     *  Add an address to the list of PRO
     *
     *  @param {string[]} address - list addresses
     *  @returns {Promise}
     */
    async addToProList(address: string[]): Promise<any> {
        try {
            const multiSender = await window.tronWeb.contract(iEXMultiSenderABI)
                .at(environment.contractAddress);

            await multiSender.addToProList(address).send();
        } catch (e) {
            this.logger.error(e);
        }
    }

    /**
     *  Remove an address from the list of PRO
     *
     *  @param {string[]} address - list addresses
     *  @returns {Promise}
     */
    async removeFromProList(address: string[]): Promise<any> {
        try {
            const multiSender = await window.tronWeb.contract(iEXMultiSenderABI)
                .at(environment.contractAddress);

            await multiSender.removeFromProList(address).send();
        } catch (e) {
            this.logger.error(e);
        }
    }

    /**
     * Check whether the user bought the status of "PRO"
     *
     * @returns {Promise}
     */
    async isPro(): Promise<any> {
        try {
            const multiSender = await window.tronWeb.contract(iEXMultiSenderABI)
                .at(environment.contractAddress);
            const result = await multiSender.isPro(this.getAddress)
                .call();
            this.addressIsPro.next(result);
            return result;
        } catch (e) {
            this.logger.error(e);
        }
    }

    /**
     * We receive the established commission
     *
     * @returns {Promise}
     */
    async getTxFee(): Promise<number> {
        try {
            const multiSender = await window.tronWeb.contract(iEXMultiSenderABI)
                .at(environment.contractAddress);

            const getTx = await multiSender.txFee().call();
            this.txFee = Number(new BigNumber(getTx).toString());

            // Check in the list of "PRO"
            this.isPro().then(status => {
                if (status == true) { this.txFee = 0; }
            });

            return this.txFee;
        } catch (e) {
            this.logger.error(e);
        }
    }

    /**
     * We receive a limit of addresses
     *
     * @returns {Promise}
     */
    async getArrayLimit(): Promise<number> {
        try {
            const multiSender = await window.tronWeb.contract(iEXMultiSenderABI)
                .at(environment.contractAddress);
            const getLimit = await multiSender.arrayLimit().call();
            this.arrayLimit = Number(new BigNumber(getLimit).toString());

            return this.arrayLimit;
        } catch (e) {
            this.logger.error(e);
        }
    }

    /**
     * Set new Array limit
     *
     * @param {number} newLimit - new limit
     * @returns {Promise}
     */
    async setArrayLimit(newLimit: number): Promise<any> {
        try {
            const multiSender = await window.tronWeb.contract(iEXMultiSenderABI)
                .at(environment.contractAddress);

            await multiSender.setArrayLimit(newLimit).send();
            this.logger.info('Change the set limit');
        } catch (e) {
            this.logger.error(e);
        }
    }

    /**
     * We load the necessary parts from the contact
     *
     * @returns {Promise}
     */
    async initContractDetails(): Promise<any> {
        await this.getArrayLimit();
        await this.getTxFee();
        await this.getBalance();
        await this.isPro();
    }

    /**
     * Get the details from "TronLink"
     *
     * @returns {any}
     */
    static get getTronWeb(): any {
        return window.tronWeb;
    }

    /**
     * Account Information
     *
     * @returns {Promise}
     */
    async getAccount(): Promise<any> {
        return new Promise((resolve: any) => {
            window.tronWeb.trx.getAccount(this.getAddress).then(account => {
                resolve(account);
            });
        }) as Promise<any>;
    }

    /**
     * Get balance
     *
     * @returns {Promise}
     */
    async getBalance(): Promise<number> {
        return new Promise((resolve) => {
            window.tronWeb.trx.getBalance(this.getAddress)
                .then(balance => {
                    this.trxBalance = this.tronWeb.fromSun(balance);
                    resolve(this.trxBalance);
                });
        }) as Promise<number>;
    }

    /**
     * Clear all data
     *
     * @return void
     */
    clearData(): void {
        this.addressToSender = [];
        this.balanceToSender = [];
        this.duplicate = [];
        this.totalBalance = 0;
    }

    /**
     * Processing of received addresses and balances
     *
     * @param {string} addresses - List addresses
     * @returns {Promise}
     */
    async parseAddresses(addresses: string): Promise<any> {
        this.clearData();
        return new Promise((resolve, reject) => {
            // Remove indents
            addresses = addresses.trim();
            try {
                this.listAddresses = JSON.parse(addresses) || [];

                // Be sure to check the received addresses.
                // If invalid addresses are found, exclude them from the list
                this.listAddresses = _.filter(this.listAddresses, (account: any) => {
                    const address = Object.keys(account)[0].replace(/\s/g, '');
                    if (this.isAddress(address)) { return account; }
                }) || [];

                // We check all data in detail before sending.
                if (this.listAddresses.length > 0) {
                    _.forEach(this.listAddresses, (account) => {
                        const address = Object.keys(account)[0].replace(/\s/g, '');
                        let balance: any = Object.values(account)[0] || 0;

                        // We add all sums
                        this.totalBalance = Number(
                            new BigNumber(balance).plus(this.totalBalance).toString(10)
                        );
                        balance = TronWebService.multiplier.times(balance);
                        this.logger.debug(`Address: ${address} - ${balance}`);

                        // Looking for the same address in order to combine
                        const indexAddr = this.addressToSender.indexOf(address);
                        if (indexAddr === -1) {
                            this.addressToSender.push(address);
                            this.balanceToSender.push(balance.toString(10));
                        } else {
                            // Write duplicate addresses
                            if (this.duplicate.indexOf(address) === -1) {
                                this.duplicate.push(address);
                            }

                            // Combine balances of duplicate addresses
                            this.balanceToSender[indexAddr] = (
                                new BigNumber(this.balanceToSender[indexAddr]).plus(balance)
                            ).toString(10);
                        }
                    });
                }

                this.listAddresses = _.map(this.addressToSender, (addr, index) => {
                    return {
                        addr,
                        balance: (new BigNumber(this.balanceToSender[index])
                            .div(TronWebService.multiplier)).toString(10)
                    };
                });

                resolve(this.listAddresses);
            } catch (e) {
                return reject('Invalid parse JSON');
            }

        });
    }

    /**
     * Total balance with decimals
     *
     * @returns {string}
     */
    totalBalanceWithDecimals(): string {
        return new BigNumber(this.totalBalance).times(TronWebService.multiplier).toString(10);
    }

    /**
     * Multiplier
     *
     * @returns {BigNumber}
     */
    static get multiplier(): BigNumber {
        const decimals = Number(6);
        return new BigNumber(10).pow(decimals);
    }

    /**
     * Total number of transactions
     *
     * @returns {number}
     */
    get totalNumberTx(): number {
        return Math.ceil(this.listAddresses.length / this.arrayLimit);
    }

    /**
     * Helper function that will convert a value in TRX to SUN
     *
     * @param {number} amount - TRX amount
     * @return number
     */
    toSun(amount: number) {
        return this.tronWeb.toSun(amount);
    }

    /**
     * Helper function that will convert a value in SUN to TRX
     *
     * @param {number} amount - Sun amount
     * @return number
     */
    public fromSun(amount: number): number {
        return this.tronWeb.fromSun(amount);
    }

    /**
     * Validate TRON Address
     *
     * @param {string} addr - Tron Address
     * @returns {boolean}
     */
    public isAddress(addr: string): boolean {
        try {
            return this.tronWeb.isAddress(addr);
        } catch (e) {
            return false;
        }
    }
}
