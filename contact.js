/* FabLab — Contact page: touch-flip for cards + form */
(function(){
  var cards=document.querySelectorAll('.flip');
  // Touch devices have no hover: tap a card to flip it (tap links inside still work)
  cards.forEach(function(c){
    c.addEventListener('click',function(e){
      if(e.target.closest('a'))return;
      var on=c.classList.contains('is-flipped');
      cards.forEach(function(x){x.classList.remove('is-flipped')});
      if(!on)c.classList.add('is-flipped');
    });
  });
  document.addEventListener('click',function(e){
    if(!e.target.closest('.flip'))cards.forEach(function(x){x.classList.remove('is-flipped')});
  });

  // Form: no server yet, so it opens the visitor's email app with the message filled in.
  // To send to a real backend later, replace this with a fetch() to Formspree / EmailJS / your API.
  var f=document.getElementById('cf'),st=document.getElementById('status');
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var d=new FormData(f);
    var body='Name: '+d.get('name')+'\nEmail: '+d.get('email')+'\nPhone: '+d.get('phone')+'\nLooking for: '+d.get('topic')+'\n\n'+d.get('msg');
    location.href='mailto:fablabinfo.800@gmail.com?subject='+encodeURIComponent('Website enquiry: '+d.get('topic'))+'&body='+encodeURIComponent(body);
    st.textContent='Thank you! Your email app is opening…';
  });
})();
