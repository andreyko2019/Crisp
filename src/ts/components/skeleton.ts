import { getElements } from '../composables/callDom';
import { CustomEvent } from './interface';

export class Skeleton {
  allSkeleton: NodeListOf<Element>;

  constructor() {
    this.allSkeleton = getElements('.skeleton');

    this.removeSkeleton();
  }

  removeSkeleton() {
    document.addEventListener('loadingIsFinished', (event: CustomEvent) => {
      let totals = 0;
      const blockImages = document.querySelectorAll('.' + event.detail.block + ' img');
      if (blockImages.length == 0) {
        this.removeClassname(event);
      }

      blockImages.forEach((img: HTMLImageElement) => {
        console.log('REQUIRED FOR ' + event.detail.block, event.detail.requiredImagesCount);
        if (img.complete) {
          totals += 1;
          if (totals >= event.detail.requiredImagesCount) {
            this.removeClassname(event);
          }
        }
        img.onload = () => {
          totals += 1;
          console.log(totals, event.detail.block);
          if (totals >= event.detail.requiredImagesCount) {
            this.removeClassname(event);
          }
        };
      });
    });
  }

  removeClassname(event) {
    this.allSkeleton.forEach((item) => {
      if (item.classList.contains(event.detail.block)) {
        item.classList.remove('skeleton');
      }
    });
  }
}
