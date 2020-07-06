import {Pipe, PipeTransform} from '@angular/core';
import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser'

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {

    constructor(private sanitized: DomSanitizer) {
    }

    transform(value) {
        return this.sanitized.bypassSecurityTrustHtml(value);
    }

}
