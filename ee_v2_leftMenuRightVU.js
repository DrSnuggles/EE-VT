//
// EasterEgg
//

"use strict";

window.ee = (function () {

  console.info("/-------------------------\\");
  console.info("|   YM easter egg found   |");
  console.info("+-------------------------+");
  console.info("| ESC := Play random song |");
  console.info("| F1  := Open Menu        |");
  console.info("\\-------------------------/");

  //
  // Init
  //

  var my = {},
  CDN = "//cdn.jsdelivr.net/gh/DrSnuggles/EE-VT/";
  CDN = "";

  addScript(CDN+'ym.min.js', function(){
    xhr(CDN+"allSongs.json", function(jSongs){
      var json = JSON.parse(jSongs);
      // prepare overlay
      var tmp = '<div id="ee_overlay" style="display:none;position:absolute;top:0;left:0;height:100vh;width:100vw;z-index:666;background-color:transparent;opacity:0.7;">';
      tmp += '<div id="ee_vu0" style="position:relative;left:20vw;width:80vw;height:33.33vh;background-color:#f88;"></div>';
      tmp += '<div id="ee_vu1" style="position:relative;left:20vw;width:80vw;height:33.33vh;background-color:#8f8;"></div>';
      tmp += '<div id="ee_vu2" style="position:relative;left:20vw;width:80vw;height:33.33vh;background-color:#88f;"></div>';
      tmp += '<div id="ee_left" style="position:absolute;left:0vw;top:0vh;width:20vw;height:100vh;background-color:#ff8;overflow:hidden;">';
        tmp += '<div id="ee_title"></div>';
        tmp += '<div id="ee_author"></div>';
        tmp += '<div id="ee_comment"></div>';
      tmp += '<select id="ee_select" onchange="ee.play(this.value)" style="font-size:10px;background-color:transparent;" size="1">';
      // change here into flat array, nicer for rng
      for (var key in json) {
        tmp += '<optgroup label="'+key+'">';
        for (var i = 0; i < json[key].length; i++){
          tmp += '<option value="'+ key +"/"+ json[key][i] +'">'+ json[key][i].substr(0,40) +'</option>';
        }
        tmp += '</optgroup>';
      }
      tmp += '</select></div>'; // ee_left

      tmp += '</div>'; // ee_overlay
      document.body.innerHTML += tmp;

      window.addEventListener("keydown", function(e){
        if (e.key === "Escape"){
          ee.playRandomSong();
        }
        if (e.key === "F1"){
          ee.toggleMenu();
        }
      });

      window.onresize = resizer;
      resizer();

      function resizer(){
        // cals size of select
        var tmp = window.innerHeight;
        tmp -= ee_title.clientHeight;
        tmp -= ee_author.clientHeight;
        tmp -= ee_comment.clientHeight;
        var tmp2 = Number(ee_select.style.fontSize.substr(0,ee_select.style.fontSize.indexOf("px"))) + 5;
        ee_select.size = Math.floor(tmp / tmp2);
      }

      ee.playRandomSong();
    });
  });

  //
  // Private
  //

  function addScript(src, cb){
    var script = document.createElement("script");
    script.onload = function(){
      cb();
    };
    script.src = src;
    document.head.appendChild(script);
  };

  function xhr(src, cb, responseType = ""){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", src, true);
    xhr.onreadystatechange = function(){
      if (this.readyState == 4 && this.status == 200){
        if (responseType === "" || responseType === "text"){
          cb(this.responseText);
        } else {
          cb(this.response);
        }
      }
    };
    xhr.responseType = responseType;
    xhr.send();
  };

  function vu(){
    ee_vu0.style.width = 80 / 17 * ee.ym.vu[0] +"vw";
    ee_vu1.style.width = 80 / 17 * ee.ym.vu[1] +"vw";
    ee_vu2.style.width = 80 / 17 * ee.ym.vu[2] +"vw";
    window.requestAnimationFrame(vu);
  }

  function getRandomInt(min, max) {
    var byteArray = new Uint16Array(1);
    window.crypto.getRandomValues(byteArray);
    var range = max - min + 1;
    var max_range = 65536;
    if (byteArray[0] >= Math.floor(max_range / range) * range)
      return getRandomInt(min, max);
    return min + (byteArray[0] % range);
  }

  //
  // Public
  //
  my.toggleMenu = function(){
    event.preventDefault();
    ee_overlay.style.display = (ee_overlay.style.display === "none") ? "block" : "none";
  };

  my.playRandomSong = function(){
    ee_select.selectedIndex = getRandomInt(0, ee_select.options.length);
    my.play( ee_select.options[ ee_select.selectedIndex ].value );
  };

  my.play = function(src){
    //src = "//modland.com/pub/modules/YM/" + src +".ym";
    src = "YM/" + src +".ym";

    xhr(src, function(data){
      if (ee.ym) {
        ee.ym.stop();
        ee.ym.clearsong();
        ee.ym.parse(data);
      } else {
        ee.ym = new YM(data);
        window.requestAnimationFrame(vu);
      }
      ee.ym.play();

      // Output infos
      src = src.substr(src.indexOf("/YM")+4);
      src = src.substr(0, src.length-3);
      var maxlength = Math.max(src.length, ee.ym.info.title.length);
      maxlength = Math.max(maxlength, ee.ym.info.author.length);
      maxlength = Math.max(maxlength, ee.ym.info.comment.length);
      maxlength += 11;
      var fillstr = "", fillstrA = "", fillstrB = "", fillstrC = "", fillstrD = "";
      for (var i = 0; i < maxlength; i++) fillstr += "-";
      for (var i = 0; i < maxlength - src.length - 11; i++) fillstrA += " ";
      for (var i = 0; i < maxlength - ee.ym.info.title.length - 11; i++) fillstrB += " ";
      for (var i = 0; i < maxlength - ee.ym.info.author.length - 11; i++) fillstrC += " ";
      for (var i = 0; i < maxlength - ee.ym.info.comment.length - 11; i++) fillstrD += " ";
      console.info("/"+fillstr+"\\");
      console.info("| Source : "+ src + fillstrA +" |");
      console.info("+"+fillstr+"+");
      console.info("| Title  : "+ ee.ym.info.title + fillstrB +" |");
      console.info("| Author : "+ ee.ym.info.author + fillstrC +" |");
      console.info("| Comment: "+ ee.ym.info.comment + fillstrD +" |");
      console.info("\\"+fillstr+"/");

      // menu output
      ee_title.innerText = "Title: "+ ee.ym.info.title;
      ee_author.innerText = "Author: "+ee.ym.info.author;
      ee_comment.innerText = "Comment: "+ee.ym.info.comment;

    }, "arraybuffer");
  };

  //
  // Exit
  //

  return my;
})();
