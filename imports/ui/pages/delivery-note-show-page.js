import './delivery-note-show-page.html';
import '../components/delivery-note/dn-header-left.js';
import '../components/delivery-note/dn-header-center-holder.js';
import '../components/delivery-note/dn-header-right.js';
import '../components/delivery-note/dn-subheader-1.js';
import '../components/delivery-note/dn-subheader-2.js';
import '../components/delivery-note/dn-main-area.js';
import '../components/delivery-note/dn-footer-1.js';
import '../components/delivery-note/dn-footer-2.js';
import '../components/delivery-note/dn-footer-3.js';

Template.DeliveryNote_show_page.events({
'click .js-print-stickers': function(e,instance) {
  e.preventDefault();

  if ($(window)
      .width() < 769) {
      $("body")
          .toggleClass("show-sidebar");
  } else {
      $("body")
          .toggleClass("hide-sidebar");
  }
  window.print();

}

});
