import { OneDress } from '../components/interface';
import { fetchComposable } from '../composables/useFetch';

export class Calculator {
  private calculation: number;
  private countElement: HTMLElement;
  private calculationElement: HTMLElement;
  private buttonCountPlus: HTMLInputElement;
  private buttonCountMinus: HTMLInputElement;
  clotherInfo: OneDress | null;

  constructor() {
    this.clotherInfo = null;
    this.calculationElement = document.getElementById('calculation')!;
    this.countElement = document.getElementById('buttonCountNumber')!;
    this.buttonCountPlus = document.getElementById('buttonCountPlus') as HTMLInputElement;
    this.buttonCountMinus = document.getElementById('buttonCountMinus') as HTMLInputElement;

    this.calculation = 0;

    this.buttonCountPlus.onclick = this.incrementCount.bind(this);
    this.buttonCountMinus.onclick = this.decrementCount.bind(this);

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

      if (this.clotherInfo.cost?.stringValue) {
        const priceString = this.clotherInfo.cost.stringValue;
        const numericPart = parseFloat(priceString.replace(',', '.'));
        if (!isNaN(numericPart)) {
          this.calculation = numericPart;
          this.updateCalculation(+this.countElement.innerHTML);
        }
      }
    }
  }

  private getDocumentIdFromURL(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  private incrementCount(): void {
    let count = +this.countElement.innerHTML;
    if (count < 999) {
      count++;
      this.countElement.innerHTML = count.toString();
      this.updateCalculation(count);
    }
  }

  private decrementCount(): void {
    let count = +this.countElement.innerHTML;
    if (count > 1) {
      count--;
      this.countElement.innerHTML = count.toString();
      this.updateCalculation(count);
    }
  }

  private updateCalculation(count: number): void {
    const total = this.calculation * count;
    this.calculationElement.innerHTML = this.formatPrice(total);
  }

  private formatPrice(price: number): string {
    return price.toFixed(2).replace('.', ',');
  }
}
