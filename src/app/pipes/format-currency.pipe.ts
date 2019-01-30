/**
 * Copyright (c) iEXBase. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatCurrency'
})
export class FormatCurrencyPipe implements PipeTransform {
    constructor(private decimalPipe: DecimalPipe) {
        //
    }

    transform(amount: number) {
        const precision = 6;
        const numericValue = this.decimalPipe.transform(
            amount,
            this.getPrecisionString(precision)
        );
        return `${numericValue} TRX`;
    }

    getPrecisionString(precision: number) {
        return `1.${precision}-${precision}`;
    }
}
