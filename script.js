/*   Abdelhalim Bouguedra    *
 * halim.bouguedra@gmail.com */

/*if (location.protocol != 'https:')
{
 location.href = 'https:' + 
    window.location.href.substring(window.location.protocol.length);
}*/

var tempC;
var tempF;
var front = true;
var hwRatio = 0.2533;
var windowHeight = $(window).height();
var windowWidth = $(window).width();
var SUN_CODES = [1000, 1003];
var L_CLOUDS_CODES = [1003, 1006, 1009];
var D_CLOUDS_CODES = [1192, 1195, 1087, 1276, 1279];
var SNOW_CODES = [1066, 1114, 1117, 1210, 1213, 1216,
                 1219, 1222, 1225, 1237, 1255, 1258,  
                 1261, 1264, 1279, 1282];
var NO_RAIN = [1009, 1030, 1135, 1147];

var imgSun = "img/sun.png";
var imgMoon = "img/moon.png";
var imgStar = "img/star.png";
var imgDrop = "img/drop.png";
var imgFlake = "img/flake.png";



/*$(window).resize(function() {
  windowHeight = $(window).height();
  windowWidth = $(window).width();
  $(".panel").css("font-size", windowWidth / 9 + "%");
  $(".panel").css("line-height", windowWidth / 70 + "px");
  console.log(windowWidth);
});*/

$("#btn-parent").click(flip);
doTheThing();

function createRaindrop(id) {
  var height = 15 * (windowWidth / 1300) +
               (Math.random() * 45 * (windowWidth / 1300));
  var width = height * hwRatio;
  var xpos = Math.random() * 110 - 10;
  var ypos = -(height * 100) / windowHeight;
  $('body').append('<img id = "' + id + '" src = ' + imgDrop +
           ' alt = "raindrop" style = "top : ' + ypos + 
           '%; left : ' + xpos + '%; width : ' + width + 
           'px; height : ' + height + 
           'px; position : absolute; z-index : -1;">');
}

function fall(id, newYpos) {
  var drop = $('#' + id);
  var height = drop.outerHeight();
  var width = drop.outerWidth();
  var newPos;
  if (newYpos < 0) {
    newYpos = 0;
  }
  drop.animate({
      top: 100 + newYpos + "%",
      left: "-=" + 10 + "%"
    },
    (1 / height) * 90000, "linear",
    function() {
      height = 15 + Math.random() * 45;
      width = height * hwRatio;

      /*the following conditioal block markes 
       * sure that approximately 80% of the drops
       * appear from the top of the screen and the 
       * remaining 20% from the right side, i.e:
       * for 80% of drop images: 
       *  (posX = random; posY = min)  
       * for 20% of drop images: 
       *  (posX = max; posY = random)*/
      if (Math.random() > 0.8) {
        newYpos = Math.random() * 100 - 
                  100 * height / windowHeight;
        newPos = 100;
      } 
      else {
        newYpos = -height;
        newPos = Math.random() * 110 - 10;
      }
      drop.css("top", newYpos + "%");
      drop.css("left", newPos + "%");
      drop.css("height", height + "px");
      drop.css("width", width + "px");

      /*makes a recursive call to the fall function, 
       * creating an infinite loop and recycling the 
       * drop images*/
      fall(id, newYpos);
    });
};

function makeItRain() {
  $('body').addClass(".rainy");
  var raindrops = 30;
  for (var i = 0; i < raindrops; i++) {
    var id = "drop" + i;
    var randomYpos = Math.random() * 100 - 100 *
                     $('#' + id).outerHeight() / windowHeight;
    createRaindrop(id)
    fall(id, randomYpos);
  }
};

function cloudUp(shade) {
  $('body').addClass('blue-sky');
  var clouds;

  if (shade > 0) {
    clouds = [
      "img/cloud1.png",
      "img/cloud2.png",
      "img/cloud3.png",
      "img/cloud4.png",
      "img/cloud5.png",
      "img/cloud6.png",
      "img/cloud7.png"
    ];
  } else {
    clouds = [
      "img/dark_cloud1.png",
      "img/dark_cloud2.png",
      "img/dark_cloud3.png",
      "img/dark_cloud4.png",
      "img/dark_cloud5.png",
      "img/dark_cloud6.png",
      "img/dark_cloud7.png"
    ];
  }
  for (var i = 0; i < 7; i++) {
    var xpos = Math.random() * 90 - Math.random() * 10;
    var ypos = Math.random() * 90 - Math.random() * 10;
    var maxHeight = (windowWidth / 10) + 
        Math.random() * (windowWidth / 5);
    $('#main').append('<div  id="cloud' + i + 
            '" style="position : absolute; left :' + 
            xpos + '%; top :' + ypos + '%">' +
            '<img src="'+ clouds[i] + '" alt="cloud image" ' + 
            'style="position: relative; max-height:' +
             maxHeight + 'px; z-index: -2"></div>');
    moveCloud(i);
  }
};

function moveCloud(i) {
  var cloud = $('#cloud' + i);
  var newXpos = Math.random() * 90 - Math.random() * 10;
  var oldXpos = parseFloat(
    document.getElementById("cloud" + i).style.left);
  var distance = Math.abs(oldXpos - newXpos);
  while (distance < 40) {
    newXpos = Math.random() * 90 - Math.random() * 10;
    distance = Math.abs(oldXpos - newXpos);
  }
  cloud.animate({
    left: newXpos + "%"
  }, {
    duration: 15000 + Math.random() * 5000,
    complete: function() {
      moveCloud(i)
    }
  });
};

function createSnowflake(id) {
  var dimension = 20 + Math.random() * 25;
  $('#main').append('<img id="snowflake' + id + 
    '" src=' + imgFlake + ' alt="snowflake" ' + 
    'style="position : absolute; width:' + dimension + 
    'px; height:' + dimension + 'px; z-index : -1" >');
}

function flakeFall(id) {
  var flake = $("#snowflake" + id);
  var xpos = Math.random() * 110 - 10;
  var dim = flake.outerHeight();
  var percentDim = 100 * dim / windowHeight;
  var variance = Math.random() * 50;
  var sineSpeed = Math.random() * 50;
  var sineAmplitude = Math.random() * 15;
  var degree = 400 * (dim / windowHeight + 1) + 4 * variance;
  var direction;
  if (id % 2) {
    direction = 1;
  } else {
    direction = -1;
  }
  $({
    myDeg: 0
  }).animate({
    myDeg: degree
  }, {
    duration: (1 / dim) * 800000,
    easing: "linear",
    step: function(now) {
      flake.css({
        transform: "rotate(" + direction * now + "deg)",
        top: now / 4 - (percentDim + variance) + "%",
        left: Math.sin(now / (50 + sineSpeed)) * 
              10 + sineAmplitude + xpos + "%"
      });
    },
    complete: function() {
      flakeFall(id);
    }
  });
}

function makeItSnow() {
  $('body').addClass("rainy");
  var snowflakes = 35;
  for (var i = 0; i < snowflakes; i++) {
    createSnowflake(i);
    flakeFall(i);
  }
};

function letThereBeSun() {
  $('#main').append('<img id="sunshine" class="spinner" src=' +
       imgSun +' alt="background sun picture" ' + 
       'style = "position : absolute; ' + 
        'left : -380px; top : -440px; z-index : -3">');
};

function nightSky() {
  for (var i = 0; i < 30; i++) {
    var xpos = Math.random() * 100;
    var ypos = Math.random() * 100;
    var dimension = 10 + Math.random() * 25;
    $('#main').append('<img src=' + imgStar + 
          ' alt="starPicture" style="position: absolute; width:' +
           dimension + 'px; height:' + dimension + 'px; left :' + 
           xpos + '%; top :' + ypos + '%; z-index : -3">');
  }
  $('#main').append('<img src ='+ imgMoon +
        ' alt="moon" style = "position : absolute;' + 
        ' height: 20%; left :10%; top :10%; z-index : -3">');
  $('body').addClass('night-sky');
};

function doTheThing() {
  $(window).resize();
  if (navigator.geolocation) {
    $("#weather-text").append("<span class='temp'>" + 
          "<h1>&nbsp;Loading...<h1><br>" + 
          "<span style='font-size: 40%'>" + 
          "please make sure the page is loaded" + 
          " over https://</span></span>");
    navigator.geolocation.getCurrentPosition(success);
  } else {
    $('#main').alert("Your browser doesn't support geolocation");
  }
}

function success(position) {
  var apiKey = "2b650cd8bbc348e1830112422162012";
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  var url = "https://api.apixu.com/v1/current.json?key=" +
           apiKey + "&q=" + latitude + "," + longitude;
  $.getJSON(url, printWeather);

  function printWeather(json, status, jqXHR) {
    var name = json.location.name + ",<br><br>" +
               json.location.region;
    tempC = json.current.temp_c + "° C";
    tempF = json.current.temp_f + "° F";
    var conditionCode = json.current.condition.code;
    var conditionText = json.current.condition.text;
    var icon = '<img class="icon" src="https://' + json.current.condition.icon +
     '" alt = "current condition icon">';
    var day = json.current.is_day;
    var sun = $.inArray(conditionCode, SUN_CODES) + 1;
    var lightClouds = $.inArray(conditionCode, L_CLOUDS_CODES) + 1;
    var darkClouds = $.inArray(conditionCode, D_CLOUDS_CODES) + 1;
    var snow = $.inArray(conditionCode, SNOW_CODES) + 1;
    var dry = $.inArray(conditionCode, NO_RAIN) + 1;
    displayWeather(day, sun, lightClouds, darkClouds, snow, dry);
    $("#weather-text").html("");
    $("#weather-text").append("<h4>" + name + 
      "</h4><br><div id='temperature'class='temp'><h1>" + 
      tempC + "</h1></div><br>" + conditionText + "<br>" + icon);
  }
}

function displayWeather(day, sun, lightClouds, darkClouds, snow, dry) {
  if (sun) {
    if (day) {
      letThereBeSun();
      $('body').addClass('sunny');
    } else {
      nightSky();
    }
    if (lightClouds) {
      cloudUp(1);
    }
  } else {
    if (!dry) {
      if (snow) {
        makeItSnow();
      } else {
        makeItRain();
      }
    }

    if (darkClouds) {
      cloudUp(0);
    } else {
      cloudUp(1);
    }

    if (day) {
      $('body').addClass('overcast');
    } else {
      nightSky();
    }
  }
}

// <  <  <  <  TOGGLE BUTTON  >  >  >  >  >
function reset(element) {
  element.removeClass();
  var clone = element.clone(true);
  element.before(clone);
  element.remove();
  return clone;
}

function flip() {
  var parent = $("#btn-parent");
  parent = reset(parent);
  parent.addClass("toggle-btn-parent rotate");
  var child = $("#btn-child");
  child = reset(child);
  var c = $("#c");
  var f = $("#f");
  c.removeClass("appear hide");
  f.removeClass("appear hide");
  if (front) {
    child.addClass("toggle-btn-child front");
    c.css("visibility", "hidden");
    f.css("visibility", "visible");
    f.addClass("appear");
    c.addClass("hide");
    $("#temperature").html("<h1>" + tempF + "</h1>");
    front = false;
  } else {
    child.addClass("toggle-btn-child back");
    f.css("visibility", "hidden");
    c.css("visibility", "visible");
    f.addClass("hide");
    c.addClass("appear");
    $("#temperature").html("<h1>" + tempC + "</h1>");
    front = true;
  }
}

// < < < TESTING > > >
//displayWeather(day, sun, lightClouds, darkClouds, snow, dry)
//displayWeather(  0,   0,           0,          1,    1,   0);
