import { OneDressBag, UserData } from '../components/interface';
import { getElement, renderElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';
import { Loader } from '../modules/stop-preload';

const wishlistWrapper = getElement('.wishlist__all-cards');

export class RenderWishlistCards {
  wishlist: { id: string; data: OneDressBag }[];
  userData: { id: string; data: UserData } | null;
  uid: string | undefined;

  constructor() {
    this.wishlist = [];
    this.userData = null;
    this.uid = this.getCookie('UID');

    this.init();
  }

  init() {
    this.connectDb();
  }

  getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift();
    }
    return undefined;
  }

  async connectDb() {
    if (!this.uid) {
      console.error('UID not found');
      return;
    }

    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    const requestBody = {
      structuredQuery: {
        from: [{ collectionId: 'users' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'uid' },
            op: 'EQUAL',
            value: { stringValue: this.uid },
          },
        },
      },
    };

    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents:runQuery`;

    try {
      const response = await fetchComposable<{ document: { name: string; fields: UserData } }[], typeof requestBody>(url, {
        method: 'POST',
        body: requestBody,
      });

      if (response.error) {
        console.error('Error fetching data:', response.error);
        return;
      }

      if (response.data && response.data.length > 0) {
        const doc = response.data[0];
        if (doc.document && doc.document.fields) {
          const docId = doc.document.name.split('/').pop() || '';
          this.userData = { id: docId, data: doc.document.fields };
        }
        await this.getWishlistDb();
      } else {
        console.error('No user data found');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async getWishlistDb() {
    if (this.userData?.data.wishlist?.arrayValue.values) {
      const firebaseConfig = {
        projectId: 'crisp-b06bf',
      };

      for (const item of this.userData.data.wishlist.arrayValue.values) {
        const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/clothers/${item.stringValue}`;

        try {
          const response = await fetchComposable<{ name: string; fields: OneDressBag }>(url, {
            method: 'GET',
          });

          if (response.error) {
            console.error('Error fetching wishlist:', response.error);
            return;
          }

          if (response.data) {
            const doc = response.data;
            if (doc && doc.fields) {
              this.wishlist.push({
                id: doc.name.split('/').pop() || '',
                data: doc.fields,
              });
            }
          }
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        }
      }

      await this.loadCards();
    } else {
      console.error('Wishlist ID not found');
    }
  }

  async loadCards() {
    this.wishlist.forEach((clother) => {
      const card = renderElement('div', ['wishlist__card', 'card', clother.id, 'skeleton']);

      const cardInfoWrapper = renderElement('div', 'card__wrapper');

      const cardImg = renderElement('div', 'card__img');
      cardImg.innerHTML = `
          <picture>
            <source srcset="${clother.data.imgWebP.stringValue}" type="image/webp" />
            <img src="${clother.data.img.stringValue}" alt="img">
          </picture>
      `;

      const cardInfo = renderElement('div', 'card__info');

      const cardTitle = renderElement('h1', 'card__title');
      cardTitle.innerText = clother.data.name.stringValue;

      const cardPrice = renderElement('p', 'card__price');
      cardPrice.innerText = clother.data.cost.stringValue;

      const cardAddToBag = renderElement('div', 'card__add-to-bag');
      cardAddToBag.innerHTML = `
            <div class="count">1</div>
            <button class="btn black">Add to cart</button>
      `;

      const cardRemove = renderElement('div', 'card__remove-and-edit');
      cardRemove.innerHTML = `
        <div class="card__remove">
          <svg>
            <use href="#remove-clother"></use>
          </svg>
        </div>
        <div class="card__edit">
          <svg>
            <use href="#edit-clother"></use>
          </svg>
        </div>
      `;

      cardInfo.appendChild(cardTitle);
      cardInfo.appendChild(cardPrice);
      cardInfo.appendChild(cardAddToBag);

      cardInfoWrapper.appendChild(cardImg);
      cardInfoWrapper.appendChild(cardInfo);

      card.appendChild(cardInfoWrapper);
      card.appendChild(cardRemove);

      wishlistWrapper?.appendChild(card);

      const removeButton = card.querySelector('.card__remove');
      if (removeButton) {
        removeButton.addEventListener('click', () => this.removeCard(clother.id, card));
      }

      Loader.stop('wishlist__card');
    });
  }

  async removeCard(cardId: string, cardElement: HTMLElement) {
    if (!this.userData) {
      console.error('User data not loaded');
      return;
    }

    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    const userDocId = this.userData.id;
    const userDocUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/users/${userDocId}?updateMask.fieldPaths=wishlist`;

    const updatedWishlist = this.userData.data.wishlist?.arrayValue.values.filter((item) => item.stringValue !== cardId) || [];

    const requestBody = {
      fields: {
        wishlist: {
          arrayValue: {
            values: updatedWishlist,
          },
        },
      },
    };

    try {
      const response = await fetchComposable<void, typeof requestBody>(userDocUrl, {
        method: 'PATCH',
        body: requestBody,
      });

      if (response.error) {
        console.error('Error removing card:', response.error);
        return;
      }

      cardElement.remove();

      this.wishlist = this.wishlist.filter((item) => item.id !== cardId);
    } catch (error) {
      console.error('Error removing card:', error);
    }
  }
}
