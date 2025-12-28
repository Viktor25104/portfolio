import { Pipe, PipeTransform } from '@angular/core';
import { TranslationsService } from '../../infrastructure/http/translations.service';

@Pipe({
  name: 'lang',
  pure: false,
  standalone: true
})
export class LangPipe implements PipeTransform {
  constructor(private translations: TranslationsService) {}

  transform(key: string): string {
    const result = this.translations.instant(key);
    return result;
  }
}
