//
// EasterEgg
//

//
// v3: CPC Style version
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

  console.info("/---------------------------\\");
  console.info("|    YM easter egg found    |");
  console.info("+---------------------------+");
  console.info("| ESC   := Toggle Menu      |");
  console.info("| Break := Play random song |");
  console.info("\\---------------------------/");

  //
  // Init
  //

  var my = {},
  CDN = "//cdn.jsdelivr.net/gh/DrSnuggles/EE-VT/";
  CDN = "";

  addScript(CDN+'ym.min.js', function(){
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
      css += '#ee_vu0{position:relative;left:20vw;width:80vw;height:33.33vh;background-color:#F66;}';
      css += '#ee_vu1{position:relative;left:20vw;width:80vw;height:33.33vh;background-color:#6F6;}';
      css += '#ee_vu2{position:relative;left:20vw;width:80vw;height:33.33vh;background-color:#66F;}';
      css += '#ee_left{position:absolute;left:0vw;top:0vh;width:20vw;height:100vh;overflow:hidden;}';
      css += '#ee_select{border:0;outline:0;}';
      css += '#ee_left,#ee_select{font-family:CPC;font-size:8px;background-color:#006;color:#FF0}';
      css += '#ee_select{width:20vw;}';
      css += '#ee_select option{text-indent:-20px;}';
      css += '#ee_select::-webkit-scrollbar{width:0px;}';
      css += '#ee_select option:hover{background-color:#FF0;color:#006}';
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
          tmp += '<select id="ee_select" onchange="ee.play(this.value)" size="1">';
          // change here into flat array, nicer for rng
          for (var key in json) {
            tmp += '<optgroup label="'+key+'">';
            for (var i = 0; i < json[key].length; i++){
              tmp += '<option value="'+ key +"/"+ json[key][i] +'">'+ json[key][i].substr(0,40) +'</option>';
            }
            tmp += '</optgroup>';
          }
          tmp += '</select>';
        tmp += '</div>'; //ee_left
      tmp += '</div>'; // ee_overlay
      document.body.innerHTML += tmp;

      // Key handler
      window.addEventListener("keydown", function(e){
        if (e.key === "Escape"){
          ee.toggleMenu();
        }
        if (e.key === "Pause"){
          ee.playRandomSong();
        }
      });

      window.onresize = resizer;
      resizer();

      function resizer(){
        // cals size of select
        var tmp = window.innerHeight;
        var tmp2 = Number(ee_select.style.fontSize.substr(0,ee_select.style.fontSize.indexOf("px"))) + 10.6;
        ee_select.size = Math.floor(tmp / tmp2);
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
    ee_overlay.classList.toggle("fadeIn");
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

    }, "arraybuffer");
  };

  //
  // Exit
  //

  return my;
})();
