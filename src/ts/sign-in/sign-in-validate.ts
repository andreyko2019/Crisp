import JustValidate from 'just-validate';
import { getElement } from '../composables/useCallDom';
import { GoAcc } from './sign-in-done';

export class SignInFormValidator {
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
      ]);

    validate.onSuccess(() => {
      console.log('Form is valid');
      new GoAcc();
    });
  }
}
