import JustValidate from 'just-validate';
import { getElement } from '../composables/useCallDom';
import { AddAddress } from './cabinet-add-new-address';

export class AddressValidate {
  form: HTMLElement[] | null;

  constructor() {
    const contactForm = getElement('.contact__form .form');
    const addressForm = getElement('.address__form .form');

    if (contactForm && addressForm) {
      this.form = [contactForm, addressForm];
    } else {
      this.form = null;
    }

    if (this.form) {
      this.init();
    }
  }

  init() {
    if (this.form) {
      this.form.forEach((item) => {
        const validate = new JustValidate(item, {
          errorLabelStyle: {
            color: '#1D1F21',
          },
        });

        validate
          .addField(getElement('#phone'), [
            {
              rule: 'required',
              errorMessage: 'Enter your phone',
            },
            {
              rule: 'customRegexp',
              value: /^\+\d{1,3}\d{9}$/,
              errorMessage: 'Write correct phone',
            },
            {
              rule: 'minLength',
              value: 10,
              errorMessage: 'Min lendth 10 symbol',
            },
            {
              rule: 'maxLength',
              value: 15,
              errorMessage: 'Max lendth 15 symbol',
            },
          ])
          .addField(getElement('#street'), [
            {
              rule: 'required',
              errorMessage: 'Enter your street',
            },
            {
              rule: 'customRegexp',
              value: /^[-\w.]+$/i,
              errorMessage: 'Write correct street',
            },
          ])
          .addField(getElement('#country'), [
            {
              rule: 'required',
              errorMessage: 'Chose your country',
            },
          ])
          .addField(getElement('#zip'), [
            {
              rule: 'required',
              errorMessage: 'Enter your zip code',
            },
            ,
            {
              rule: 'customRegexp',
              handler: (value: string) => {
                const regex = /^\d{5}$/;
                return regex.test(value);
              },
              errorMessage: 'Write correct zip code',
            },
          ]);

        validate.onSuccess(() => {
          console.log('Form is valid');
          new AddAddress();
        });
      });
    }
  }
}
