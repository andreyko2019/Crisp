import JustValidate from 'just-validate';
import { getElement } from '../composables/useCallDom';
import { CreateAcc } from './sign-up-done';

export class SignUpFormValidator {
  form: HTMLElement | null;

  constructor() {
    this.form = getElement('.form');

    if (this.form) {
      this.init();
    }
  }

  init() {
    const validate = new JustValidate(this.form!, {
      errorLabelStyle: {
        color: '#1D1F21',
      },
    });

    validate
      .addField(getElement('#name-sign-up'), [
        {
          rule: 'required',
          errorMessage: 'Enter your name',
        },
        {
          rule: 'customRegexp',
          value: /^[-\w.]+$/i,
          errorMessage: 'Write correct name',
        },
      ])
      .addField(getElement('#surname-sign-up'), [
        {
          rule: 'required',
          errorMessage: 'Enter your surname',
        },
        {
          rule: 'customRegexp',
          value: /^[-\w.]+$/i,
          errorMessage: 'Write correct surname',
        },
      ])
      .addField(getElement('#email'), [
        {
          rule: 'required',
          errorMessage: 'Enter your email',
        },
        {
          rule: 'customRegexp',
          value: /^[-\w.]+@([а-яёa-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/,
          errorMessage: 'Write correct email',
        },
      ])
      .addField(getElement('#password'), [
        {
          rule: 'required',
          errorMessage: 'Enter your password',
        },
        {
          rule: 'customRegexp',
          value: /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/,
          errorMessage: 'Incorrect password format',
        },
      ])
      .addField(getElement('#confirm-password'), [
        {
          rule: 'required',
          errorMessage: 'Repeat your password',
        },
        {
          validator: (value: string) => {
            const passwordValue = (document.getElementById('password') as HTMLInputElement).value;
            return value === passwordValue;
          },
          errorMessage: 'Passwords must match',
        },
      ]);

    validate.onSuccess(() => {
      new CreateAcc();
    });
  }
}
