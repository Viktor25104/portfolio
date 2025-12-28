import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationsService } from '../../core/services/translations.service';
import { LangPipe } from '../../core/pipes/lang-pipe';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  telegram: string;
  subject: string;
  message: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

interface FormMessage {
  type: 'success' | 'error';
  text: string;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  color: string;
  label: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, LangPipe],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Contact implements OnInit {
  formData: ContactForm = {
    name: '',
    email: '',
    phone: '',
    telegram: '',
    subject: '',
    message: ''
  };

  errors: Partial<Record<keyof ContactForm, string>> = {};
  // Отслеживание касания полей для показа ошибок
  touched: Partial<Record<keyof ContactForm, boolean>> = {};
  submitted = false;
  isSubmitting = false;
  formMessage: FormMessage | null = null;
  emailCopied = false;
  translationsLoaded = false;

  isAvailable = true;

  // Социальные ссылки
  socialLinks: SocialLink[] = [
    {
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/in/viktor-marymorych-8355232a0/',
      icon: 'assets/icons/linkedin.svg',
      color: '#0077b5',
      label: 'LinkedIn Profile'
    },
    {
      platform: 'GitHub',
      url: 'https://github.com/Viktor25104',
      icon: 'assets/icons/github.svg',
      color: '#333',
      label: 'GitHub Profile'
    },
    {
      platform: 'Telegram',
      url: 'https://t.me/Viktor_M2',
      icon: 'assets/icons/telegram.svg',
      color: '#0088cc',
      label: 'Telegram Contact'
    }
  ];

  private telegramToken = '7001859314:AAGFspxGUEAptoLX9WdBc5RNi9n3mcndVNU';
  private telegramChatId = '1649458810';

  constructor(public translations: TranslationsService) {}

  async ngOnInit() {
    try {
      await this.translations.waitForTranslations();
      this.translationsLoaded = true;
      console.log('✅ Translations loaded for contact component');
    } catch (error) {
      console.error('❌ Failed to load translations:', error);
      this.translationsLoaded = true;
    }
  }

  // Помечаем поле как "тронутое" при фокусе
  onFieldFocus(field: keyof ContactForm): void {
    this.touched[field] = true;
  }

  // Валидация при вводе
  onFieldInput(field: keyof ContactForm): void {
    this.touched[field] = true;
    this.validateField(field);
  }

  // Проуперяем должна ли показываться ошибка
  shouldShowError(field: keyof ContactForm): boolean {
    return !!(this.errors[field] && (this.touched[field] || this.submitted));
  }

  validateField(field: keyof ContactForm): void {
    const value = typeof this.formData[field] === 'string' ? this.formData[field].trim() : '';

    switch (field) {
      case 'name':
        if (!value) {
          this.errors.name = this.translations.instant('NAME_REQUIRED');
        } else if (value.length < 2) {
          this.errors.name = this.translations.instant('NAME_REQUIRED');
        } else {
          delete this.errors.name;
        }
        break;

      case 'email':
        if (!value) {
          this.errors.email = this.translations.instant('EMAIL_REQUIRED');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          this.errors.email = this.translations.instant('EMAIL_INVALID');
        } else {
          delete this.errors.email;
        }
        break;

      case 'phone':
        if (!value) {
          this.errors.phone = this.translations.instant('PHONE_REQUIRED');
        } else if (!/^[\+]?[\d\s\-\(\)]{7,15}$/.test(value.replace(/\s/g, ''))) {
          // Более гибкая валидация телефона - разрешаем пробелы, скобки, дефисы
          this.errors.phone = this.translations.instant('PHONE_INVALID');
        } else {
          delete this.errors.phone;
        }
        break;

      case 'subject':
        if (!value) {
          this.errors.subject = this.translations.instant('SUBJECT_REQUIRED');
        } else if (value.length < 5) {
          this.errors.subject = this.translations.instant('SUBJECT_REQUIRED');
        } else {
          delete this.errors.subject;
        }
        break;

      case 'message':
        if (!value) {
          this.errors.message = this.translations.instant('MESSAGE_REQUIRED');
        } else if (value.length < 10) {
          this.errors.message = this.translations.instant('MESSAGE_REQUIRED');
        } else {
          delete this.errors.message;
        }
        break;

      case 'telegram':
        // optional field - no validation needed
        break;
    }
  }

  isFormValid(): boolean {
    // Проверяем все обязательные поля
    const name = this.formData.name.trim();
    const email = this.formData.email.trim();
    const phone = this.formData.phone.trim();
    const subject = this.formData.subject.trim();
    const message = this.formData.message.trim();

    const isValid = (
      name.length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      /^[\+]?[\d\s\-\(\)]{7,15}$/.test(phone.replace(/\s/g, '')) &&
      subject.length >= 5 &&
      message.length >= 10 &&
      Object.keys(this.errors).length === 0
    );

    console.log('Form validation:', {
      name: name.length >= 2,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      phone: /^[\+]?[\d\s\-\(\)]{7,15}$/.test(phone.replace(/\s/g, '')),
      subject: subject.length >= 5,
      message: message.length >= 10,
      noErrors: Object.keys(this.errors).length === 0,
      errors: this.errors,
      isValid
    });

    return isValid;
  }

  async onSubmit(): Promise<void> {
    await this.submitForm();
  }

  async submitForm(): Promise<void> {
    // Помечаем форму как отправленную
    this.submitted = true;

    // Валидируем все поля
    this.validateField('name');
    this.validateField('email');
    this.validateField('phone');
    this.validateField('subject');
    this.validateField('message');

    // Помечаем все поля как тронутые для показа ошибок
    Object.keys(this.formData).forEach(key => {
      this.touched[key as keyof ContactForm] = true;
    });

    if (!this.isFormValid()) {
      console.log('Form is invalid, showing errors');
      return;
    }

    this.isSubmitting = true;
    this.formMessage = null;

    const text = `
📥 New Contact Request

👤 Name: ${this.formData.name}
📧 Email: ${this.formData.email}
📱 Phone: ${this.formData.phone}
✈️ Telegram: ${this.formData.telegram || '-'}
📝 Subject: ${this.formData.subject}

💬 Message:
${this.formData.message}
    `.trim();

    try {
      const url = `https://api.telegram.org/bot${this.telegramToken}/sendMessage`;
      const body = {
        chat_id: this.telegramChatId,
        text,
        parse_mode: 'HTML'
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        this.formMessage = {
          type: 'success',
          text: this.translations.instant('FORM_SUCCESS')
        };
        this.resetForm();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Telegram Error:', error);
      this.formMessage = {
        type: 'error',
        text: this.translations.instant('FORM_ERROR')
      };
    }

    this.isSubmitting = false;
  }

  resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      telegram: '',
      subject: '',
      message: ''
    };
    this.errors = {};
    this.touched = {};
    this.submitted = false;
  }

  downloadResume(): void {
    const link = document.createElement('a');
    link.href = 'assets/files/resume.pdf';
    link.download = 'Viktor_Marimorich_Resume.pdf';
    link.click();
  }

  copyEmail(): void {
    navigator.clipboard.writeText('viktormarimorich@gmail.com');
    this.emailCopied = true;
    setTimeout(() => (this.emailCopied = false), 2000);
  }
}
