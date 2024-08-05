import { getElement, getElements, renderElement } from '../composables/useCallDom';
import { auth } from '../modules/firebase';
import { signOut } from 'firebase/auth';

const bagList = getElement('.bag__list');

export class Burger {
  burgerBtn: HTMLElement | null;
  menuAdapt: HTMLElement | null;
  bagBtn: HTMLElement | null;
  accBlock: HTMLElement | null;
  accBlockMob: NodeListOf<HTMLElement> | null;

  constructor() {
    this.burgerBtn = getElement('.burger-btn');
    this.menuAdapt = getElement('.header__menu_adapt');
    this.bagBtn = getElement('.buy__bag');
    this.accBlock = getElement('.log-and-sign');
    this.accBlockMob = getElements('.header__menu_adapt .menu__item');

    this.burger();
    this.bag();
    this.goAcc();
  }

  burger() {
    const context = this;

    this.burgerBtn?.addEventListener('click', function () {
      context.burgerBtn?.classList.toggle('active');
      context.menuAdapt?.classList.toggle('active');
    });
  }

  bag() {
    const bagBtnSvg = this.bagBtn?.querySelector('.bag');
    const bagBtnSumm = this.bagBtn?.querySelector('.summ');
    if (bagBtnSvg && bagBtnSumm && bagList) {
      bagBtnSvg.addEventListener('click', function () {
        bagList.classList.toggle('active');
      });
      bagBtnSumm.addEventListener('click', function () {
        bagList.classList.toggle('active');
      });
    }

    const closeBag = bagList?.querySelector('.pop-up__close');
    if (closeBag && bagList) {
      closeBag.addEventListener('click', function () {
        bagList.classList.remove('active');
      });
    }
  }

  goAcc() {
    const uid = this.getCookie('UID');

    if (uid && this.accBlock && this.accBlockMob) {
      this.accBlock.innerHTML = `
       <a href="/cabinet#account-dashboard" class="my-acc">MY ACCOUNT</a>
       <a href="javascript:void(0);" class="log-out">LOG OUT</a>
      `;

      this.accBlockMob[this.accBlockMob.length - 1].remove();
      this.accBlockMob[this.accBlockMob.length - 2].remove();

      const menu = getElement('.header__menu_adapt .menu');
      const goAccMob = renderElement('li', 'menu__item');
      goAccMob.innerHTML = `
       <a href="/cabinet#account-dashboard" class="my-acc">MY ACCOUNT</a>
      `;

      const logOut = renderElement('li', 'menu__item');
      logOut.innerHTML = `
       <a href="javascript:void(0);" class="log-out">LOG OUT</a>
      `;

      menu?.appendChild(goAccMob);
      menu?.appendChild(logOut);

      const logOutBtns = getElements('.log-out');
      logOutBtns.forEach((logOutBtn) => {
        logOutBtn.addEventListener('click', this.logOut.bind(this));
      });
    }
    else if (this.accBlock && this.accBlockMob) {
      this.accBlock.innerHTML = `
       <a href="/sign-in" class="signin">SIGN IN</a>
       <a href="/sign-up" class="create">CREATE AN ACCOUNT</a>
      `;

      const menu = getElement('.header__menu_adapt .menu');
      const goAccMob = renderElement('li', 'menu__item');
      goAccMob.innerHTML = `
       <a href="/sign-in" class="signin">SIGN IN</a>
      `;

      const createAnAccount = renderElement('li', 'menu__item');
      createAnAccount.innerHTML = `
       <a href="/sign-up" class="create">CREATE AN ACCOUNT</a>
      `;

      menu?.appendChild(goAccMob);
      menu?.appendChild(createAnAccount);
    }
  }

  getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift();
    }
    return undefined;
  }

  deleteCookie(name: string) {
    document.cookie = name + '=; Max-Age=-99999999;';
  }

  logOut() {
    signOut(auth)
      .then(() => {
        this.deleteCookie('UID');
        window.location.href = '/';
      })
      .catch((error) => {
        console.error('Sign Out Error', error);
      });
  }
}
