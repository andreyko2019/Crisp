// burger.ts
import { getElement, getElements, renderElement } from '../composables/useCallDom';
import { auth } from '../modules/firebase'; // Import the auth instance
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
    if (bagList) {
      this.bagBtn?.addEventListener('click', function () {
        bagList.classList.toggle('active');
      });
    }
  }

  goAcc() {
    const uid = this.getCookie('UID');
    console.log(uid);

    if (uid && this.accBlock && this.accBlockMob) {
      // Desktop
      this.accBlock.innerHTML = `
       <a href="/Crisp/cabinet.html" class="my-acc">MY ACCOUNT</a>
       <a href="javascript:void(0);" class="log-out">LOG OUT</a>
      `;

      // Mobile
      this.accBlockMob[this.accBlockMob.length - 1].remove();
      this.accBlockMob[this.accBlockMob.length - 2].remove();

      const menu = getElement('.header__menu_adapt .menu');
      const goAccMob = renderElement('li', 'menu__item');
      goAccMob.innerHTML = `
       <a href="/Crisp/cabinet.html" class="my-acc">MY ACCOUNT</a>
      `;

      const logOut = renderElement('li', 'menu__item');
      logOut.innerHTML = `
       <a href="javascript:void(0);" class="log-out">LOG OUT</a>
      `;

      menu?.appendChild(goAccMob);
      menu?.appendChild(logOut);

      // Add event handlers for logout buttons
      const logOutBtns = getElements('.log-out');
      logOutBtns.forEach((logOutBtn) => {
        logOutBtn.addEventListener('click', this.logOut.bind(this));
      });
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
        window.location.href = '/Crisp/index.html';
      })
      .catch((error) => {
        console.error('Sign Out Error', error);
      });
  }
}
