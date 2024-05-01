export class Loader {
  static stop() {
    const loadingIsFinished = new Event('loadingIsFinished');
    document.dispatchEvent(loadingIsFinished);
  }
}

// Пример использования
