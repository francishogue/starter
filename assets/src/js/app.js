import '@babel/polyfill';
// import $ from 'jquery';
import svg4everybody from 'svg4everybody';
import './components/helpers';
// import menu from './components/menu';

// window.jQuery = $;
// console.log($.fn.jquery);

(() => {
  console.log('[global]: init');
  svg4everybody();
})();
