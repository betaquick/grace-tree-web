import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Template } from '../../../shared/models/template-model';


@Component({
  selector: 'app-company-template-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatePreviewComponent {
  @Input() template: Template;
}
