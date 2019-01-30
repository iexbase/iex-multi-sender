/**
 * Copyright (c) iEXBase. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


import * as _ from 'lodash';

export const isJson = (str: string): boolean => {
    try {
        const json = JSON.parse(str) || [];
        if (!_.isEmpty(json)) { return true; }
        else { return false; }

    } catch (e) {
        return false;
    }
    return true;
};
