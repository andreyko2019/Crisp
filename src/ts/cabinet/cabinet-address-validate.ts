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
          errorMessage: 'Write correct phone (examp.+380ххххххххх)',
        },
        {
          rule: 'minLength',
          value: 10,
          errorMessage: 'Min length 10 symbols',
        },
        {
          rule: 'maxLength',
          value: 15,
          errorMessage: 'Max length 15 symbols',
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
          errorMessage: 'Choose your country',
        },
      ])
      .addField(getElement('#state-hidden'), [
        {
          rule: 'required',
          errorMessage: 'Choose your state/province',
        },
      ])
      .addField(getElement('#zip'), [
        {
          rule: 'required',
          errorMessage: 'Enter your zip code',
        },
        {
          rule: 'customRegexp',
          value: /^[0-9]{5}$/,
          errorMessage: 'Write correct zip code',
        },
      ]);

    validate.onSuccess(() => {
      new AddAddress();
      window.location.reload();
    });
  }
}
