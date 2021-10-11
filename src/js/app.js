import Visualization from "./modules/visualization/app.js";

var visualization,
    yearsSlider,
    playButton = document.querySelector("#playButton"),

    animation = "stop",
    animationInterval,
    currentAnimationYear,
    maxAnimationYear;

/** Initializes the visualization interface. */
function init() {
  visualization = new Visualization();

  document.querySelector("#aboutButton").addEventListener("click", function() {
    document.querySelector("#aboutWrapper").style.display = "initial";
  });

  document.querySelector("#helpButton").addEventListener("click", function() {
    document.querySelector("#helpWrapper").style.display = "initial";
  });

  playButton.addEventListener("click", playLife);
  registerAnimations();
}

/** Handles the life animation. */
function playLife() {

  if (visualization.filtered != "all") {
    visualization.changeData("all");
  }

  yearsSlider = document.querySelector(".yearsSlider");
  maxAnimationYear = yearsSlider.getAttribute("max");

  // Set listeners to stop the animation
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

  // Actual handling of the play animation
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

/** Handles one year of the life animation. */
function playOneLifeYear() {
  yearsSlider = document.querySelector(".yearsSlider");

  if ((currentAnimationYear < maxAnimationYear) && (animation != "stop")) {
    currentAnimationYear += 1;
    yearsSlider.value = currentAnimationYear;
    visualization.renderLettersByYear(visualization.allYears[currentAnimationYear]);

    // Start faster interval for years without content
    if (["1782", "1842", "1848", "1886"].includes(visualization.allYears[currentAnimationYear])) {
      clearInterval(animationInterval);
      animationInterval = setInterval(playOneLifeYear, 100)
    }

    // Start slower interval for years with content
    if (["1802", "1846", "1884", "1898"].includes(visualization.allYears[currentAnimationYear])) {
      clearInterval(animationInterval);
      animationInterval = setInterval(playOneLifeYear, 800)
    }
  } else {
    stopLife();
  }
}

/** Stops the life animation. */
function stopLife() {
  animation = "stop";
  clearInterval(animationInterval);
  playButton.innerHTML = "&#9654; Play";
}

/** Initializes several animations. */
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

/** Slides introductory screen upwards, reveals main visualization. */
function revealVisualization() {
  document.querySelector("#overlay").classList.add("placed");
  setTimeout(function() {
    document.querySelector("#overlay").style.visibility = "hidden";
  }, 1500);
}



init();
