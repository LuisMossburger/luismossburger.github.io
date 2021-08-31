import ConnectorCollections from "../../helpers/ConnectorCollections.js";
import ConnectorItems from "../../helpers/ConnectorItems.js";

class KeywordSearch {

  constructor(include_filters) {
    self = this;
    self.conItems = new ConnectorItems(include_filters),
    self.conCollections = new ConnectorCollections();

    self.filterTemplate;
    self.filtersContainer;
    self.include_filters = include_filters;
    self.conItems.change_format("", "json");
  }

  include_keywordSearch(location, template) {
    location.appendChild(document.importNode(template.content, true));
    self.register_search_listeners();
  }

  include_filterContainer(locationTemplate, filterTemplate) {
    self.include_filters = true;
    self.filterTemplate = filterTemplate;
    self.filtersContainer = locationTemplate;
    document.querySelector("body").appendChild(document.importNode(locationTemplate.content, true));
  }

  register_search_listeners() {
    self.searchField = document.querySelector(".searchField"),
    self.searchButton = document.querySelector(".searchButton"),
    self.results = document.querySelector(".results"),
    self.resultsList = document.querySelector(".resultsList"),
    self.resultsMetadata = document.querySelector(".resultsMetadata"),
    self.resultsItemTemplate = document.querySelector("#resultsItemTemplate");

    self.searchButton.addEventListener("click", self.search);
    self.searchField.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        self.search();
      }
    });
  }

  register_filter_listeners() {
    var filterOptions = document.querySelectorAll(".filterOption"),
        filterRemovers = document.querySelectorAll(".filterRemove");

    for (let option of filterOptions) {
      option.addEventListener("click", function() {
        self.filter(option.innerHTML, option.parentNode.parentNode.querySelector("h3.filterHeader").innerHTML);
      });
    }

    for (let remover of filterRemovers) {
      remover.addEventListener("click", function() {
        self.filter("", remover.parentNode.querySelector("h3.filterHeader").innerHTML);
      });
    }
  }

  search() {
    self.conItems.keyword_search(self.searchField.value, self.printResults);
  }

  filter(field, value) {
    self.conItems.filter(field, value, self.printResults);
  }

  printResults(result) {
    var data = JSON.parse(result);
    console.log(data);
    self.printSearch(data);
    self.printFilters(data);
  }

  printSearch(data) {
    //var metadata = data["pagination"]["numFound"] + " results found. Query: " + data["pagination"]["query"].split("q=")[1];

    self.resultsList.innerHTML = "";

    for (let i = data["items"]["mods"].length - 1; i >= 0; i--) {
      try {
        if (Array.isArray(data["items"]["mods"][i]["titleInfo"])) {
          self.resultsItemTemplate.content.querySelector(".title").innerHTML = data["items"]["mods"][i]["titleInfo"][0]["title"];
        } else {
          self.resultsItemTemplate.content.querySelector(".title").innerHTML = data["items"]["mods"][i]["titleInfo"]["title"];
        }
      } catch (e) {
        console.log(e);
      }

      try {
        if (Array.isArray(data["items"]["mods"][i]["name"])) {
          if (Array.isArray(data["items"]["mods"][i]["name"][0]["namePart"])) {
            self.resultsItemTemplate.content.querySelector(".author").innerHTML = data["items"]["mods"][i]["name"][0]["namePart"][0] + " et al.";
          } else {
            self.resultsItemTemplate.content.querySelector(".author").innerHTML = data["items"]["mods"][i]["name"][0]["namePart"] + " et al.";
          }
        } else {
          if (Array.isArray(data["items"]["mods"][i]["name"]["namePart"])) {
            self.resultsItemTemplate.content.querySelector(".author").innerHTML = data["items"]["mods"][i]["name"]["namePart"][0];
          } else {
            self.resultsItemTemplate.content.querySelector(".author").innerHTML = data["items"]["mods"][i]["name"]["namePart"];
          }
        }
      } catch (e) {
        console.log(e);
      }

      self.resultsList.appendChild(document.importNode(self.resultsItemTemplate.content, true));
      self.resultsItemTemplate.content.querySelector(".title").innerHTML = "";
      self.resultsItemTemplate.content.querySelector(".author").innerHTML = "";
    }

    //self.resultsMetadata.innerHTML = metadata;
  }

  printFilters(data) {
    document.querySelector(".filters .filtersContent").innerHTML = "";

    document.querySelector(".filters").style.display = "block"; // set visible

    for (let filter of data["facets"]["facetField"]) {
      self.filterTemplate.content.querySelector("h3.filterHeader").innerHTML = filter["facetName"];

      for (let i = 0; i < filter["facet"].length; i++) {
        if (i < 5) {
          let option = filter["facet"][i];
          self.filterTemplate.content.querySelector("ul.filterContent").innerHTML +=
            "<li class='filterOption'>" + option["term"] + "</li>";
        } else {
          break;
        }
      }

      document.querySelector(".filters .filtersContent").appendChild(document.importNode(self.filterTemplate.content, true));
      self.filterTemplate.content.querySelector("ul.filterContent").innerHTML = "";
    }

    self.register_filter_listeners();
  }
}

export default KeywordSearch;
