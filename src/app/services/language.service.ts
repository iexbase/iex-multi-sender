/**
 * Copyright (c) iEXBase. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { LocalStorage } from 'ngx-webstorage';


@Injectable()
export class LanguageService {

    /***
     * Current language
     *
     * @var any
     */
    @LocalStorage()
    language: string;

    /**
     * List of available languages
     *
     * @var array
     */
    private languages = [{
            name: 'English',
            isoCode: 'en'
        }
    ];

    /**
     * Actual language
     *
     * @var string
     */
    private current: string;

    /**
     * Object creation LanguageProvider
     *
     * @param {NGXLogger} logger - Log service
     * @param {TranslateService} translate - Translate Manager
     */
    constructor(
        private logger: NGXLogger,
        private translate: TranslateService
    ) {
        this.logger.debug('LanguageService initialized');
        this.translate.onLangChange.subscribe(event => {
            this.logger.info('Setting new default language to: ' + event.lang);
        });
    }

    /**
     * Loading language
     *
     *  @return void
     */
    async load(): Promise<any> {
        if (!_.isEmpty(this.language)) {
            this.current = this.language;
        } else {
            // Get from browser
            const browserLang = this.translate.getBrowserLang();
            this.current = this.getName(browserLang)
                ? browserLang : this.getDefault();
        }
        this.logger.info('Default language: ' + this.current);
        this.translate.setDefaultLang(this.current);
    }

    /**
     * Change language
     *
     * @param {string} lang - new lang
     * @return void
     */
    public set(lang: string): void {
        this.current = lang;
        this.translate.use(lang);

        // write a new language
        this.language = lang;
    }

    /**
     * Get the name of the language
     *
     * @param {string} lang - language iso code
     * @return string
     */
    public getName(lang: string): string {
        return _.result(
            _.find(this.languages, {
                isoCode: lang
            }),
            'name'
        );
    }

    /**
     * Get default language
     *
     * @return string
     */
    private getDefault(): string {
        return this.languages[0]['isoCode'];
    }

    /**
     * Get current language
     *
     * @return string
     */
    public getCurrent(): string {
        return this.current;
    }

    /**
     * Get list languages
     *
     * @return LanguageInterface[]
     */
    public getAvailables(): any[] {
        return this.languages;
    }
}
