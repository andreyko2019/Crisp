export class Calculator {
  private calculation: number;
  private countElement: HTMLElement;
  private calculationElement: HTMLElement;
  private buttonCountPlus: HTMLInputElement;
  private buttonCountMinus: HTMLInputElement;

  constructor() {
    this.calculationElement = document.getElementById('calculation')!;
    this.countElement = document.getElementById('buttonCountNumber')!;
    this.buttonCountPlus = document.getElementById('buttonCountPlus') as HTMLInputElement;
    this.buttonCountMinus = document.getElementById('buttonCountMinus') as HTMLInputElement;

    const initialPriceText = this.calculationElement.innerHTML.trim();
    this.calculation = +initialPriceText.replace(',', '.');

    this.buttonCountPlus.onclick = this.incrementCount.bind(this);
    this.buttonCountMinus.onclick = this.decrementCount.bind(this);
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
