import KeywordSearch from "./modules/keywordSearch/app.js";
import Visualization from "./modules/visualization/app.js";

const INCLUDE_KEYWORDSEARCH = false;
const INCLUDE_FILTERS = false;

var keywordSearch,
    visualization;

var keywordSearchTemplate = document.querySelector("#keywordSearchTemplate"),
    filtersContainerTemplate = document.querySelector("#filtersContainerTemplate"),
    filterTemplate = document.querySelector("#filterTemplate"),
    playButton = document.querySelector("#playButton"),
    animation = false;

function init() {
  visualization = new Visualization();

  if (INCLUDE_KEYWORDSEARCH) {
    include_keywordSearch(document.getElementById("include_keywordSearch"), keywordSearchTemplate);
  }

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

  if (!animation) {
    var yearsSlider = document.querySelector(".yearsSlider"),
        currentValue = 1,
        endValue = yearsSlider.getAttribute("max");

    if (visualization.filtered != "all") {
      visualization.changeData("all");
    }

    playButton.innerHTML = "&#9209; &nbsp;Stop";

    animation = setInterval(function() {
      if (currentValue < endValue) {
        currentValue += 1;
        visualization.renderLettersByYear(visualization.allYears[currentValue]);
      } else {
        playLife();
      }
    }, 600);
  } else {
    clearInterval(animation);
    animation = false;
    //visualization.changeData("all");
    playButton.innerHTML = "&#9654; Play";
  }
}

function registerAnimations() {
  // Initial animation
  window.addEventListener("load", function() {
    document.querySelector("#overlay h1").classList.add("placed");
  });

  // Parallax effect on start overlay
  document.querySelector("#overlay").addEventListener("mousemove", function(e) {
    var amountMovedX = 1700 + (e.pageX * -1 / 6);
    var amountMovedY = 1300 + (e.pageY * -1 / 6);

    document.querySelector("#parallaxBackground").innerHTML = "div#overlay:before { background-position: " + amountMovedX + "px " + amountMovedY + "px; }";
  });

  // Reveal visualization on arrow click or scroll
  document.querySelector("#overlay #arrowDown").addEventListener("click", revealVisualization);
  document.addEventListener("mousewheel", revealVisualization);
  document.addEventListener("DOMMouseScroll", revealVisualization);
}

function revealVisualization() {
  document.querySelector("#overlay").classList.add("placed");
  setTimeout(function() {
    document.querySelector("#overlay").style.display = "none";
  }, 1500);

  document.removeEventListener("mousewheel", revealVisualization);
  document.removeEventListener("DOMMouseScroll", revealVisualization);
}

init();
