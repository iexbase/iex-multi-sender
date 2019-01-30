/**
 * Copyright (c) iEXBase. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { FormControl } from '@angular/forms';
import { isJson } from './utils';

export class JsonValidator {
    constructor() {}
    /**
     * Validate JSON
     *
     * @param {FormControl} control - Initializing Form Controls
     */
    isValid(control: FormControl) {
        return isJson(control.value)
            ? null
            : { 'Invalid Address': true };
    }
}
