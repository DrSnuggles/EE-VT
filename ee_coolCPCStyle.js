//
// EasterEgg
//

//
// v3: CPC Style version
//
//
// CPC Modes:
// #  X   Y   Zeichen
// 0  160 200 20
// 1  320 200 40
// 2  640 200 80
//
// CPC Colors:
// #  Name            Code
// 0  Black           #000
// 1  Blue            #006
// 2  Bright Blue     #00F
// 3  Red             #600
// 4  Magenta         #606
// 5  Mauve           #60F
// 6  Bright Red      #F00
// 7  Purple          #F06
// 8  Bright Magenta  #F0F
// 9  Green           #060
// 10 Cyan            #066
// 11 Sky Blue        #06F
// 12 Yellow          #660
// 13 White           #666
// 14 Pastel Blue     #66F
// 15 Orange          #F60
// 16 Pink            #F66
// 17 Pastel Magenta  #F6F
// 18 Bright Green    #0F0
// 19 Sea Green       #0F6
// 20 Bright Cyan     #0FF
// 21 Lime Green      #6F0
// 22 Pastel Green    #6F6
// 23 Pastel Cyan     #6FF
// 24 Bright Yellow   #FF0
// 25 Pastel Yellow   #FF6
// 26 Bright White    #FFF

"use strict";

window.ee = (function () {

  console.info("/---------------------------------\\");
  console.info("|       YM easter egg found       |");
  console.info("+---------------------------------+");
  console.info("| ESC         := Toggle Menu      |");
  console.info("| Break / RMB := Play random song |");
  console.info("\\---------------------------------/");

  //
  // Init
  //

  var my = {},
  lstTime = new Date(),
  CDN = "//cdn.jsdelivr.net/gh/DrSnuggles/EE-VT/";
  CDN = "";

  addScript(CDN+'ym.js', function(){
    xhr(CDN+"allSongs.json", function(jSongs){
      //
      // Late init after all is loaded
      //
      var json = JSON.parse(jSongs);
      // prepare overlay
      // overlay: css
      var css = '@font-face{font-family:"CPC";src:url("cpc.woff2") format("woff2");}';
      css += '#ee_overlay{background-color:#006;position:absolute;top:0;left:0;width:100vw;height:100vh;z-index:2147483647;opacity:0;transition:opacity 0.5s ease-in-out;overflow:hidden;}';
      css += '#ee_overlay.fadeIn{opacity:1}';
      css += '#ee_vu0{position:absolute;bottom:0;left:0vw;width:33.33vw;height:0vh;background-color:#F66;}';
      css += '#ee_vu1{position:absolute;bottom:0;left:33.33vw;width:33.33vw;height:0vh;background-color:#6F6;}';
      css += '#ee_vu2{position:absolute;bottom:0;left:66.66vw;width:33.33vw;height:0vh;background-color:#66F;}';
      css += '#ee_left{position:absolute;left:0vw;top:0vh;width:100vw;height:100vh;overflow:hidden;}';
      css += '#ee_select{border:0;outline:0;}';
      css += '#ee_left,#ee_select{font-family:CPC;font-size:2.5vw;color:#FF0}'; // 5vw = 20 column mode, 2.5vw = 40 column mode, 1.25vw = 80 column mode
      css += '#ee_select{width:100vw;background-color:transparent;}';
      css += '#ee_select option{text-indent:-25px;}';
      css += '#ee_select::-webkit-scrollbar{width:0px;}';
      css += '#ee_select option:hover{background-color:#FF0;color:#006}';
      css += '#ee_select::selection{background-color:#FF0;color:#006}';
      var style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css;
      document.getElementsByTagName('head')[0].appendChild(style);
      // overlay: html
      var tmp = '<div id="ee_overlay">';
        tmp += '<div id="ee_vu0"></div>';
        tmp += '<div id="ee_vu1"></div>';
        tmp += '<div id="ee_vu2"></div>';
        tmp += '<div id="ee_left">';
          tmp += '<select id="ee_select" onchange="ee.play(this.value)" size="2">';
          // change here into flat array, nicer for rng
          for (var key in json) {
            tmp += '<optgroup label="'+key+'">';
            for (var i = 0; i < json[key].length; i++){
              tmp += '<option value="'+ key +"/"+ json[key][i] +'">'+ json[key][i] +'</option>';
            }
            tmp += '</optgroup>';
          }
          tmp += '</select>';
        tmp += '</div>'; //ee_left
      tmp += '</div>'; // ee_overlay
      document.body.innerHTML += tmp;

      // rmb = random song
      ee_overlay.oncontextmenu = function(){
        // due to max zindex its always fireing
        if (ee_overlay.classList.contains("fadeIn")){
          ee.playRandomSong();
          return false;
        }
      }
      // Key handler
      window.addEventListener("keydown", function(e){
        if (e.key === "Escape"){
          ee.toggleMenu();
        }
        if (e.key === "Pause"){
          ee.playRandomSong();
        }
      });

      // SongEnd handler
      document.addEventListener("songend", function(e){
        ee.playRandomSong();
      });

      // Resizer
      window.onresize = resizer;
      resizer();
      function resizer(){
        ee_select.size = Math.max(2, Math.floor(window.innerHeight / ee_select.options[0].clientHeight) );
      }

      ee.playRandomSong();
      ee.toggleMenu();
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
    // display channel vu
    ee_vu0.style.height = 100 / 17 * ee.ym.vu[0] +"vh";
    ee_vu1.style.height = 100 / 17 * ee.ym.vu[1] +"vh";
    ee_vu2.style.height = 100 / 17 * ee.ym.vu[2] +"vh";
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

  function formatTime(ms){
    // returns mm:ss
    var ss = Math.floor(ms / 1000);
    var mm = Math.floor(ss / 60);
    ss -= mm * 60;
    if (ss<10) ss = "0"+ ss;
    if (mm<10) mm = "0"+ mm;
    return mm +":"+ ss;
  }

  //
  // Public
  //
  my.toggleMenu = function(){
    ee_overlay.classList.toggle("fadeIn");
  };

  my.playRandomSong = function(){
    ee_select.selectedIndex = getRandomInt(0, ee_select.options.length);
    my.play( ee_select.options[ ee_select.selectedIndex ].value );
  };

  my.play = function(src){
    //src = "//modland.com/pub/modules/YM/" + src +".ym";
    src = "YM/" + src +".ym";
    src = src.replace(/#/g, "%23");

    xhr(src, function(data){
      if (ee.ym) {
        ee.ym.stop();
        ee.ym.clearsong();
        ee.ym.parse(data);
      } else {
        ee.ym = new YM(data);
        window.requestAnimationFrame(vu);// start vu
      }
      ee.ym.play();
      ee.ym.player.loop = 0;

      // Output
      var fillstr = "", fillstrA = "", fillstrB = "", fillstrC = "", fillstrD = "";
      // old infos
      var dur = new Date();
      dur -= lstTime;
      dur = formatTime(dur);
      lstTime = new Date();
      for (var i = 0; i < dur.length+18; i++) fillstr += "-";
      console.info("/"+fillstr+"\\");
      console.info("| last Playtime : "+ dur +" |");
      console.info("\\"+fillstr+"/");
      // new infos
      src = src.substr(src.indexOf("/YM")+4);
      src = src.substr(0, src.length-3);
      var maxlength = Math.max(src.length, ee.ym.info.title.length);
      maxlength = Math.max(maxlength, ee.ym.info.author.length);
      maxlength = Math.max(maxlength, ee.ym.info.comment.length);
      maxlength += 11;
      fillstr = "";
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

    }, "arraybuffer");
  };

  //
  // Exit
  //

  return my;
})();