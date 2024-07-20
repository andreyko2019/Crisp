import JustValidate from 'just-validate';
import { getElement } from '../composables/useCallDom';
import { AddAddress } from './cabinet-add-new-address';

export class AddressValidate {
  form: HTMLElement | null;

  constructor() {
    this.form = getElement('.add-address .form');

    if (this.form) {
      this.init();
    }
  }

  init() {
    console.log(getElement('#phone'), getElement('#street'), getElement('#country'), getElement('#zip'));
    const validate = new JustValidate(this.form, {
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
      .addField(getElement('#country-hidden'), [
        {
          rule: 'required',
          errorMessage: 'Chose your country',
        },
      ])
      .addField(getElement('#state-hidden'), [
        {
          rule: 'required',
          errorMessage: 'Chose your state/province',
        },
      ])
      .addField(getElement('#zip'), [
        {
          rule: 'required',
          errorMessage: 'Enter your zip code',
        },
        {
          rule: 'customRegexp',
          value: /^[0-9]{6}$/,
          errorMessage: 'Write correct zip code',
        },
      ]);

    validate.onSuccess(() => {
      console.log('Form is valid');
      new AddAddress();
      window.location.reload();
    });
  }
}
