import KeywordSearch from "./modules/keywordSearch/app.js";
import Visualization from "./modules/visualization/app.js";

const INCLUDE_KEYWORDSEARCH = false;
const INCLUDE_FILTERS = false;

var keywordSearch,
    visualization;

var yearsSlider,
    animation = "stop",
    animationInterval,
    currentAnimationYear,
    maxAnimationYear;

var keywordSearchTemplate = document.querySelector("#keywordSearchTemplate"),
    filtersContainerTemplate = document.querySelector("#filtersContainerTemplate"),
    filterTemplate = document.querySelector("#filterTemplate"),
    playButton = document.querySelector("#playButton");

function init() {
  visualization = new Visualization();

  if (INCLUDE_KEYWORDSEARCH) {
    include_keywordSearch(document.getElementById("include_keywordSearch"), keywordSearchTemplate);
  }

  // Register Popups
  document.querySelector("#aboutButton").addEventListener("click", function() {
    document.querySelector("#aboutWrapper").style.display = "initial";
  });

  document.querySelector("#helpButton").addEventListener("click", function() {
    document.querySelector("#helpWrapper").style.display = "initial";
  });

  playButton.addEventListener("click", playLife);
  registerAnimations();
}

function include_keywordSearch(location, template) {
  keywordSearch = new KeywordSearch(INCLUDE_FILTERS);
  keywordSearch.include_keywordSearch(location, template);

  if (INCLUDE_FILTERS && INCLUDE_KEYWORDSEARCH) {
    include_filters();
  }
}

function include_filters() {
  keywordSearch.include_filterContainer(filtersContainerTemplate, filterTemplate);
}

function playLife() {

  if (visualization.filtered != "all") {
    visualization.changeData("all");
  }

  yearsSlider = document.querySelector(".yearsSlider");
  maxAnimationYear = yearsSlider.getAttribute("max");
  yearsSlider.addEventListener("input", function() {animation = "stop";});
  yearsSlider.addEventListener("change", function() {animation = "stop";});

  document.querySelector("#filterYear").addEventListener("click", function() {animation = "stop";});
  document.querySelector("#filterPersons").addEventListener("click", function() {animation = "stop";});
  document.querySelector("#filterFamily").addEventListener("click", function() {animation = "stop";});
  document.querySelector("#filterGroups").addEventListener("click", function() {animation = "stop";});
  document.querySelector("#filterOthers").addEventListener("click", function() {animation = "stop";});

  // If animation was stopped, reset the timer
  if (animation == "stop") {
    currentAnimationYear = 1;
  }

  if (animation == "stop" || animation == "pause") {
    animation = "play";
    playButton.innerHTML = "&#10074;&#10074; &nbsp;Pause";
    animationInterval = setInterval(playOneLifeYear, 800);
  } else if (animation == "play") {
    animation = "pause";
    clearInterval(animationInterval);
    playButton.innerHTML = "&#9654; Play";
  }
}

function playOneLifeYear() {
  yearsSlider = document.querySelector(".yearsSlider");

  if ((currentAnimationYear < maxAnimationYear) && (animation != "stop")) {
    currentAnimationYear += 1;
    yearsSlider.value = currentAnimationYear;
    visualization.renderLettersByYear(visualization.allYears[currentAnimationYear]);

    // Start faster interval for empty years
    if (["1782", "1842", "1848", "1886"].includes(visualization.allYears[currentAnimationYear])) {
      clearInterval(animationInterval);
      animationInterval = setInterval(playOneLifeYear, 100)
    }

    // Start slower interval for filled years
    if (["1802", "1846", "1884", "1898"].includes(visualization.allYears[currentAnimationYear])) {
      clearInterval(animationInterval);
      animationInterval = setInterval(playOneLifeYear, 800)
    }
  } else {
    stopLife();
  }
}

function stopLife() {
  animation = "stop";
  clearInterval(animationInterval);
  playButton.innerHTML = "&#9654; Play";
}

function registerAnimations() {
  // Initial animation
  window.addEventListener("load", function() {
    document.querySelector("#overlay h1").classList.add("placed");
    document.querySelector("#overlay #overlayFooter").classList.add("placed");
  });

  // Parallax effect on start overlay
  document.querySelector("#overlay").addEventListener("mousemove", function(e) {
    var amountMovedX = 1700 + (e.pageX * -1 / 6);
    var amountMovedY = 1300 + (e.pageY * -1 / 6);

    document.querySelector("#parallaxBackground").innerHTML = "div#overlay:before { background-position: " + amountMovedX + "px " + amountMovedY + "px; }";
  });

  // Reveal visualization on arrow click or scroll
  document.querySelector("#overlay #arrowDown").addEventListener("click", revealVisualization);
}

function revealVisualization() {
  document.querySelector("#overlay").classList.add("placed");
  setTimeout(function() {
    document.querySelector("#overlay").style.visibility = "hidden";
  }, 1500);
}

init();
