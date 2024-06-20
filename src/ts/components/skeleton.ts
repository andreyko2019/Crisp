import { getElements } from '../composables/useCallDom';
import { CustomEvent } from './interface';

export class Skeleton {
  allSkeleton: NodeListOf<Element>;

  constructor() {
    this.allSkeleton = getElements('.skeleton');

    this.removeSkeleton();
  }

  removeSkeleton() {
    document.addEventListener('loadingIsFinished', (event: CustomEvent) => {
      this.allSkeleton = getElements('.skeleton');

      let totals = 0;
      if (event.detail) {
        const blockImages: NodeListOf<HTMLImageElement> = document.querySelectorAll('.' + event.detail.block + ' img');
        if (blockImages.length == 0) {
          this.removeClassname(event);
        }

        blockImages.forEach((img: HTMLImageElement) => {
          if (img.complete) {
            totals += 1;
            if (event.detail?.requiredImagesCount) {
              if (totals >= event.detail.requiredImagesCount) {
                this.removeClassname(event);
              }
            }
          }
          img.onload = () => {
            totals += 1;
            if (event.detail?.requiredImagesCount) {
              if (totals >= event.detail.requiredImagesCount) {
                this.removeClassname(event);
              }
            }
          };
        });
      }
    });
  }

  removeClassname(event: CustomEvent) {
    this.allSkeleton.forEach((item) => {
      if (event.detail?.block) {
        if (item.classList.contains(event.detail.block)) {
          item.classList.remove('skeleton');
        }
      }
    });
  }
}
