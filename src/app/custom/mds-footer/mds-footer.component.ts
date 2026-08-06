import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Divider } from 'primeng/divider';
import type { MdsFooterLink } from './mds-footer.types';

@Component({
  selector: 'mds-footer',
  standalone: true,
  imports: [Divider],
  templateUrl: './mds-footer.component.html',
  styleUrls: ['./mds-footer.tokens.scss', './mds-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdsFooterComponent {
  readonly productVersion = input('A-CDM V 1.0.0');
  readonly copyrightText = input('© Copyright 2026');
  readonly companyLinkLabel = input('www.indracompany.com');
  readonly companyLinkHref = input('https://www.indracompany.com');
  readonly showCompanyLink = input(true);
  readonly links = input<readonly MdsFooterLink[]>(DEFAULT_FOOTER_LINKS);
  readonly logoSrc = input('indra-logo.png');
}

const DEFAULT_FOOTER_LINKS: MdsFooterLink[] = [
  { label: 'Link', href: '#' },
  { label: 'Link', href: '#' },
  { label: 'Link', href: '#' },
];
