import { getElement } from '../composables/useCallDom';
import noUiSlider from 'nouislider';

export function rangeSliderWork() {
  const rangeSlider = document.getElementById('range-slider');

  if (rangeSlider) {
    noUiSlider.create(rangeSlider, {
      start: [50, 1000],
      step: 1,
      connect: true,
      range: {
        min: 50,
        max: 1000,
      },
    });

    const inputFirst = getElement('.range__input_first');
    const inputSecond = getElement('.range__input_second');
    const inputs = [inputFirst, inputSecond];

    rangeSlider.noUiSlider.on('update', function (values: any, handle: any) {
      inputs[handle].value = Math.round(values[handle]);
    });

    const setRangeSlider = (input, value) => {
      const array = [null, null];
      array[input] = value;
      rangeSlider.noUiSlider.set(array);
      console.log(array);
    };

    inputs.forEach((input, index) => {
      input?.addEventListener('change', (event) => {
        setRangeSlider(index, event.currentTarget.value);
        console.log(event.currentTarget.value);
      });
    });
  }
}
