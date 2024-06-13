import { OneDress } from '../components/interface';
import { getElement, getElements } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';

const brandElement = getElement('.info__brand p');
const titleElement = getElement('.info__title');
const colorBtns = getElements('.info__color-btns');
const sizesAll = getElements('.sizes__list label');
const priceElement = getElement('.price__total span');

export class MainInfo {
  clotherInfo: OneDress | null;

  constructor() {
    this.clotherInfo = null;
    this.init();
  }

  init() {
    this.conectDb();
  }

  private async conectDb() {
    const docId = this.getDocumentIdFromURL();

    if (!docId) {
      console.error('Document ID not found in URL');
      return;
    }

    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/clothers/${docId}`;

    const response = await fetchComposable<{ fields: OneDress }, null>(url, {
      method: 'GET',
    });

    if (response.error) {
      console.error('Error fetching document:', response.error);
      return;
    }

    if (response.data) {
      this.clotherInfo = response.data.fields;
      console.log(this.clotherInfo);
      this.updateUI();
    }
  }

  private getDocumentIdFromURL(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  private updateUI() {
    this.brandAndTitle();
    this.colors();
    this.size();
    this.price();
  }

  private brandAndTitle() {
    if (brandElement && titleElement) {
      if (this.clotherInfo) {
        brandElement.textContent = this.clotherInfo.brand?.stringValue || 'No brand';
        titleElement.textContent = this.clotherInfo.name?.stringValue || 'No title';
        console.log(brandElement, titleElement);
      } else {
        brandElement.textContent = 'No brand';
        titleElement.textContent = 'No title';
      }
    }
  }

  private colors() {
    if (this.clotherInfo?.color?.arrayValue?.values) {
      this.clotherInfo.color.arrayValue.values.forEach((color) => {
        if (colorBtns) {
          colorBtns.forEach((btns) => {
            btns.insertAdjacentHTML(
              'beforeend',
              `
              <div class="color color__${color.stringValue}">
                  <input type="radio" id="${color.stringValue}" name="color" />
                  <div class="custom-radio"></div>
              </div>
              `
            );
          });
        }
      });
    }
  }

  private size() {
    if (this.clotherInfo?.size?.arrayValue?.values) {
      console.log('Sizes from Firestore:', this.clotherInfo.size.arrayValue.values);

      this.clotherInfo.size.arrayValue.values.forEach((size) => {
        const sizeValue = size.stringValue?.trim();
        if (sizeValue && sizesAll) {
          sizesAll.forEach((btns) => {
            const btnTextContent = btns.textContent?.trim();

            if (btnTextContent === sizeValue) {
              btns.classList.remove('no-size');
            }
          });
        }
      });
    }
  }

  private price() {
    if (priceElement && this.clotherInfo?.cost?.stringValue) {
      const priceString = this.clotherInfo.cost.stringValue;
      const numericPart = priceString.split(' ')[0];

      priceElement.textContent = numericPart;
    }
  }
}
