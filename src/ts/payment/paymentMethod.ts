import JustValidate from 'just-validate';
import { getElement, getElements } from '../composables/useCallDom';

export function paymentMethod() {
  class Payment {
    form: HTMLElement | null;
    figures: NodeListOf<HTMLElement> | null;
    submitAdressButton: HTMLElement | null;
    backButton: NodeListOf<HTMLElement> | null;
    paymentForms: HTMLElement | null;
    response: HTMLElement | null;

    firstNameInput: HTMLInputElement | null;
    lastNameInput: HTMLInputElement | null;
    firstUserNameOutput: HTMLElement | null;
    lastUserNameOutput: HTMLElement | null;

    userCompanyInput: HTMLInputElement | null;
    userCompanyOutput: HTMLElement | null;

    userArdressInput: HTMLInputElement | null;
    userAdressOutput: HTMLElement | null;

    userRegionInput: HTMLInputElement | null;
    userRegionOutput: HTMLElement | null;

    userCountryInput: HTMLInputElement | null;
    userCountryOutput: HTMLElement | null;

    constructor() {
      this.form = getElement('#adress-form');
      this.figures = getElements('.select-box__figures');
      this.submitAdressButton = getElement('.submit-adress');
      this.backButton = getElements('.back');
      this.paymentForms = getElement('.payment__forms');
      this.response = getElement('.response');

      this.firstNameInput = getElement('.first-name') as HTMLInputElement;
      this.lastNameInput = getElement('.last-name') as HTMLInputElement;

      this.firstUserNameOutput = getElement('.user-name');
      this.lastUserNameOutput = getElement('.user-last-name');

      this.userCompanyInput = getElement('.company') as HTMLInputElement;
      this.userCompanyOutput = getElement('.user-company');

      this.userArdressInput = getElement('.adress1') as HTMLInputElement;
      this.userAdressOutput = getElement('.user-adress');

      this.userRegionInput = getElement('.adress2') as HTMLInputElement;
      this.userRegionOutput = getElement('.user-region');

      this.userCountryInput = getElement('.country') as HTMLInputElement;
      this.userCountryOutput = getElement('.user-country');

      if (this.form) {
        this.init();
      }

      this.backButton.forEach((button) => {
        button.addEventListener('click', (event) => {
          event.preventDefault();
          console.log('clicked');
          this.paymentForms?.classList.remove('payment__forms_unvis');
          this.response?.classList.remove('response_active');
          this.figures?.forEach((figure) => {
            this.figures?.forEach((fig) => {
              fig.classList.remove('active-figure');
            });
            figure.classList.add('active-figure');
          });
        });
      });
    }

    init() {
      const validate = new JustValidate(this.form!, {
        errorLabelStyle: {
          color: '#1D1F21',
        },
        tooltip: {
          position: 'bottom',
        },
      });

      validate
        .addField('#first-name', [
          {
            rule: 'required',
          },
          {
            rule: 'minLength',
            value: 3,
          },
          {
            rule: 'maxLength',
            value: 15,
          },
        ])
        .addField('#last-name', [
          {
            rule: 'required',
          },
          {
            rule: 'minLength',
            value: 3,
          },
          {
            rule: 'maxLength',
            value: 15,
          },
        ])
        .addField('#adress1', [
          {
            rule: 'required',
          },
          {
            rule: 'minLength',
            value: 3,
          },
          {
            rule: 'maxLength',
            value: 15,
          },
        ]);
      // .addField('#select-region', [
      //   {
      //     rule: 'required',
      //   },
      // ]);

      validate.onSuccess(() => {
        console.log('validate');
        this.figures?.forEach((figure) => {
          this.figures?.forEach((fig) => {
            fig.classList.remove('active-figure');
          });
          figure.classList.add('active-figure');
        });

        this.paymentForms?.classList.add('payment__forms_unvis');
        this.response?.classList.add('response_active');
      });

      this.firstNameInput?.addEventListener('input', () => {
        if (this.firstUserNameOutput) {
          this.firstUserNameOutput.textContent = this.firstNameInput?.value ?? '';
        }
      });

      this.lastNameInput?.addEventListener('input', () => {
        if (this.lastUserNameOutput) {
          this.lastUserNameOutput.textContent = this.lastNameInput?.value ?? '';
        }
      });

      this.userCompanyInput?.addEventListener('input', () => {
        if (this.userCompanyOutput) {
          this.userCompanyOutput.textContent = this.userCompanyInput?.value ?? '';
        }
      });

      this.userArdressInput?.addEventListener('input', () => {
        if (this.userAdressOutput) {
          this.userAdressOutput.textContent = this.userArdressInput?.value ?? '';
        }
      });

      this.userRegionInput?.addEventListener('input', () => {
        if (this.userRegionOutput) {
          this.userRegionOutput.textContent = this.userRegionInput?.value + ',';
        }
      });

      this.userCountryInput?.addEventListener('input', () => {
        if (this.userCountryOutput) {
          this.userCountryOutput.textContent = this.userCountryInput?.value ?? '';
        }
      });
    }
  }

  new Payment();
}
