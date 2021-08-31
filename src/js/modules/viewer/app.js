var diva,
    apiBaseUrl = "https://api.lib.harvard.edu/v2/items?recordIdentifier=",
    iiifBaseUrl = "https://iiif.lib.harvard.edu/manifests/drs:",
    popUp = document.querySelector("#documentViewer");

function init() {

  document.addEventListener('DOMContentLoaded', function () {
      diva = new Diva('diva-wrapper', {
          objectData: "https://iiif.lib.harvard.edu/manifests/drs:465181948", //"./test/manifests/iiifv3.json",
          plugins: [Diva.DownloadPlugin, Diva.ManipulationPlugin, Diva.MetadataPlugin],
          verticallyOriented: false,
          enableToolbar: false,
          zoomLevel: 1
      });
  }, false);

  document.querySelector(".zoomSlider").addEventListener("input", zoom);
}

function zoom() {
  var zoom = diva.getZoomLevel() - document.querySelector(".zoomSlider").value;

  if (zoom < 0) {
    for (let i = 0; i < Math.abs(zoom); i++) {
      diva.zoomIn();
    }
  } else if (zoom > 0) {
    for (let i = 0; i < Math.abs(zoom); i++) {
      diva.zoomOut();
    }
  }

  // Workaround
  // This ensures that correct zoom level is displayed even if the
  // slider is moved very fast
  diva.setZoomLevel(diva.getZoomLevel());
}

function showDocument(id) {
  var docs = document.querySelectorAll(".document"),
      url = apiBaseUrl + id,
      xhttp = new XMLHttpRequest();

  popUp.style.display = "initial";
  document.addEventListener("keyup", hideDocument);
  document.addEventListener("click", hideDocument);

  // Workaround because of problems for certain letters
  diva.setZoomLevel(4);

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let iiifID = parseInt(this.responseText.split('<mods:url access="preview">https://ids.lib.harvard.edu/ids/iiif/')[1].split('/full/,150/0/default.jpg</mods:url>')[0]),
          iiifUrl = iiifBaseUrl + (iiifID - 2);
      console.log(iiifUrl);
      diva.changeObject(iiifUrl);

      // Workaround because of problems for certain letters
      zoom();
    }
  };

  xhttp.open("GET", url, true);
  xhttp.send();

  // Highlight chosen document
  for (let i = 0; i < docs.length; i++) {
    docs[i].style.borderColor = "transparent";
  }
  document.querySelector(".document[data-id='" + id + "']").style.borderColor = "#119da4";
}

function hideDocument(hideEvent) {
  if ("keyCode" in hideEvent) {
    if (hideEvent.keyCode == 27) {
      popUp.style.display = "none";
      document
      document.removeEventListener("keyup", hideDocument);
      document.removeEventListener("click", hideDocument);
    }
  } else if (hideEvent.target == popUp) {
    popUp.style.display = "none";
    document.removeEventListener("keyup", hideDocument);
    document.removeEventListener("click", hideDocument);
  }
}

init();
