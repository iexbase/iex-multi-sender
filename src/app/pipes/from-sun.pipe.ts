import {Pipe, PipeTransform} from '@angular/core';
import {TronWebService} from '../services/tronweb.service';

@Pipe({
    name: 'fromSun',
    pure: false
})
export class FromSunPipe implements PipeTransform {

    /**
     * Create a new FromSunPipe object
     *
     * @param {TronWebService} tron - Tron provider
     */
    constructor(
        private tron: TronWebService
    ) {
        //
    }

    transform(amount: number) {
        return this.tron.fromSun(amount);
    }
}
