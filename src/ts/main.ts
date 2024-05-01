import { Burger } from './components/burger';
import { Accordion } from './components/accordion';
import { SummerSale } from './main/summer-sale-swiper';
import { getElements } from './composables/callDom';
import { Loader } from './modules/stop-preload';
// import { Skeleton } from './components/skeleton';

document.addEventListener('DOMContentLoaded', async function () {
  new Burger();
  new Accordion();
  new SummerSale();
  Loader.stop();
});
class Skeleton {
  allSkeleton: NodeListOf<Element>;

  constructor() {
    this.allSkeleton = getElements('.skeleton');
    this.removeSkeleton();
  }

  removeSkeleton() {
    Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((resolve) => {
              img.onload = img.onerror = resolve;
            })
        )
    ).then(() => {
      this.allSkeleton.forEach((item) => {
        item.classList.remove('skeleton');
        console.log('remove');
      });
    });
  }
}

document.addEventListener('loadingIsFinished', () => {
  new Skeleton();
});
