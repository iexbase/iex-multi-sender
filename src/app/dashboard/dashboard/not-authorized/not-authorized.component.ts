/**
 * Copyright (c) iEXBase. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

// Services
import { TronWebService } from '../../../services/tronweb.service';

@Component({
    selector: 'app-not-authorized',
    templateUrl: './not-authorized.component.html',
    styleUrls: ['./not-authorized.component.scss']
})
export class NotAuthorizedComponent {

    /**
     * Object creation NotAuthorizedComponent
     *
     * @param {TronWebService} tronWebService - TronWeb service
     * @param {MatSnackBar} snackBar - Service to dispatch Material Design snack bar messages.
     * @param {TranslateService} translate - Translate service
     */
    constructor(
        private tronWebService: TronWebService,
        private snackBar: MatSnackBar,
        private translate: TranslateService
    ) {
        //
    }

    /**
     * Update TronLink connection
     *
     * @return void
     */
    update(): void {
        this.tronWebService.initTronWeb(); // reload
        if (!this.tronWebService.loggedIn) {
            this.snackBar.open(this.translate.instant('NoConnectionEstablished'), null, {
                duration: 1000,
            });
        } else {
            this.snackBar.open(this.translate.instant('ConnectionEstablished'), null, {
                duration: 1000,
            });
        }
    }
}
