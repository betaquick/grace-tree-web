import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeHtml'
})
export class SanitizeHtmlPipe implements PipeTransform {

  constructor(private _sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(value);
  }

}

@Pipe({
  name: 'nl2br'
})
export class NewlineToBreakTag implements PipeTransform {
  transform(value: string): string {
    return (value || '').replace(/(?:\\r\\n|\\r|\\n)/gm, '<br />');
  }
}
