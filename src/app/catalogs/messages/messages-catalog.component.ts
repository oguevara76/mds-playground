import { Component } from '@angular/core';
import { Message } from 'primeng/message';
import { ToastCatalogComponent } from './toast-catalog.component';
import {
  MESSAGE_CONTENT,
  MESSAGE_SEVERITIES,
  MESSAGE_SEVERITY_ICONS,
  MESSAGE_SIZE_OPTIONS,
  MESSAGE_VARIANTS,
  type MessageInteractionSize,
  type MessagePrimeVariant,
  type MessageSeverity,
  type MessageVariantKey,
} from './messages-catalog.config';

@Component({
  selector: 'app-messages-catalog',
  standalone: true,
  imports: [Message, ToastCatalogComponent],
  templateUrl: './messages-catalog.component.html',
  styleUrl: './messages-catalog.component.css',
})
export class MessagesCatalogComponent {
  readonly content = MESSAGE_CONTENT;
  readonly severities = MESSAGE_SEVERITIES;
  readonly variants = MESSAGE_VARIANTS;
  readonly sizeOptions = MESSAGE_SIZE_OPTIONS;

  primeVariant(key: MessageVariantKey): MessagePrimeVariant {
    return MESSAGE_VARIANTS.find((v) => v.key === key)?.primeVariant;
  }

  primeSize(size: MessageInteractionSize): 'small' | 'large' | undefined {
    return MESSAGE_SIZE_OPTIONS.find((o) => o.key === size)?.pSize;
  }

  trackSeverity(_: number, s: { key: MessageSeverity }): MessageSeverity {
    return s.key;
  }

  severityIcon(severity: MessageSeverity): string {
    return MESSAGE_SEVERITY_ICONS[severity];
  }
}
