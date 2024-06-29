export class Loader {
  static stop(block = '') {
    const blockImages = document.querySelectorAll('.' + block + ' img');
    const requiredImagesCount = blockImages.length;
    const loadingIsFinished = new CustomEvent('loadingIsFinished', {
      detail: {
        block: block,
        requiredImagesCount: requiredImagesCount,
      },
    });
    document.dispatchEvent(loadingIsFinished);
  }
}
