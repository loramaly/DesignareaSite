/* Portfolio filter on the home page: All / UX/UI / Digital Design.
   Each .case-card carries data-cat; "all" is the default on every load. */
(function(){
  var bar = document.querySelector('.works-filter');
  if(!bar) return;
  var btns = bar.querySelectorAll('.wf-btn');
  var cards = document.querySelectorAll('.cards .case-card[data-cat]');

  function apply(filter){
    btns.forEach(function(b){
      var on = b.dataset.filter === filter;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    cards.forEach(function(c){
      c.classList.toggle('is-filtered', filter !== 'all' && c.dataset.cat !== filter);
    });
  }

  bar.addEventListener('click', function(e){
    var b = e.target.closest('.wf-btn');
    if(b) apply(b.dataset.filter);
  });
  apply('all');
})();
