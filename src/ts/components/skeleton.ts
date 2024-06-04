import { getElements } from '../composables/callDom';

export class Skeleton {
  allSkeleton: NodeListOf<Element>;

  constructor() {
    this.allSkeleton = getElements('.skeleton');
    this.removeSkeleton();
  }

  removeSkeleton() {
    document.addEventListener('loadingIsFinished', () => {
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
        });
      });
    });
  }
}
