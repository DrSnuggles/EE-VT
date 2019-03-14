//
// EasterEgg
//

"use strict";

(function () {
  window.addEventListener('keydown', function(e){
    if (e.key === "Escape"){
      if (!window.music) {
        addScript('codef_music.js', function(){
          ee();
        });
      }else{
        ee();
      }
    }
  });

  function addScript(sURL, cb){
    var script = document.createElement('script');
    script.onload = function(){
      cb();
    };
    script.src = sURL;
    document.head.appendChild(script);
  }

  function ee(){
    if (!window.player){
      window.player = new music("YM");
      player.LoadAndRun('IKARIWAR.YM');
    }
  }
})();
