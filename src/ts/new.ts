import { Burger } from './components/burger';
import { Accordion } from './components/accordion';
import { Loader } from './modules/stop-preload';
import { NewBaner } from './new/new-baner';
import { NewInfo } from './new/new-info';
import { LikeSwiper } from './components/you-may-also-like';

document.addEventListener('DOMContentLoaded', async () => {
  new Burger();
  new Accordion();
  new LikeSwiper();
  new NewBaner();
  new NewInfo();
  Loader.stop();
});
