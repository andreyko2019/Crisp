export class Redirect {
  uid: string | undefined;

  constructor() {
    this.uid = this.getCookie('UID');

    this.init();
  }

  init() {
    console.log(this.uid);
    if (!this.uid) {
      window.location.href = '/Crisp/index.html';
      return;
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
}
