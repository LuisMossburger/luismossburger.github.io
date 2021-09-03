import DataIngestor from "../dataIngestor/app.js";

class Visualization {

  constructor() {

    self = this;

    this.radius = 200,
    this.width = (this.radius * 2) + 50,
    this.height = (this.radius * 2) + 50,
    this.filtered = "all",
    this.numNodes,
    this.allYears;

    this.filterPersons = [],
    this.filterYear = "",
    this.filterPersonsButton = document.querySelector("button#filterPersons"),
    this.filterYearButton = document.querySelector("button#filterYear");

    this.color_cyan = "#119da4",
    this.color_pink = "#E34A6F",
    this.color_yellow = "#F7CB15",
    this.color_light = "#3E4C65";

    this.filter_family = document.querySelector("#filterFamily"),
    this.filter_persons = document.querySelector("#filterOthers"),
    this.filter_groups = document.querySelector("#filterGroups"),
    this.filters = [this.filter_family, this.filter_persons, this.filter_groups];

    this.personsContainer = document.querySelector(".infoPersons"),
    this.personTemplate = document.querySelector("#personTemplate"),
    this.documentsContainer = document.querySelector(".documentsContainer"),
    this.documentTemplate = document.querySelector("#documentTemplate");

    this.svg = d3
      .select("#visualization")
      .attr("viewBox", "0 0 " + this.width + " " + this.height);

    this.dataIngestor = new DataIngestor();
    this.dataIngestor.readData(this.init);

    this.images = {
      "Channing, William Ellery": ["channingwilliamellery_child.jpg", "channingwilliamellery_teen.jpg", "channingwilliamellery_young.jpg", "channingwilliamellery.jpg", "channingwilliamellery_old.jpg"],
      "unknown": "unknown.png",
      "Ellery, William": ["ellerywilliam_child.jpg", "ellerywilliam_teen.jpg", "ellerywilliam_young.jpg", "ellerywilliam.PNG", "ellerywilliam_old.jpg"],
      "Channing, Lucy Ellery": ["channinglucyellery_child.jpg", "channinglucyellery_teen.jpg", "channinglucyellery_young.jpg", "channinglucyellery.PNG", "channinglucyellery_old.jpg"],
      "Channing, William Francis": ["channingwilliamfrancis_child.jpg", "channingwilliamfrancis_teen.jpg", "channingwilliamfrancis_young.jpg", "channingwilliamfrancis.PNG", "channingwilliamfrancis_old.jpg"],
      "Clay, Henry": ["clayhenry_child.jpg", "clayhenry_teen.jpg", "clayhenry_young.jpg", "clayhenry.PNG", "clayhenry_old.jpg"],
      "Dewey, Orville": "deweyorville.PNG",
      "Tuckerman, Joseph": ["tuckermanjoseph_child.jpg", "tuckermanjoseph_teen.jpg", "tuckermanjoseph_young.jpg", "tuckermanjoseph.PNG", "tuckermanjoseph_old.jpg"],
      "Worcester, Noah": ["worcesternoah_child.jpg", "worcesternoah_teen.jpg", "worcesternoah_young.jpg", "worcesternoah.PNG", "worcesternoah_old.jpg"],
      "Dwight, John S.": ["dwightjohns_child.jpg", "dwightjohns_teen.jpg", "dwightjohns_young.jpg", "dwightjohns.PNG", "dwightjohns_old.jpg"],
      "Bleecker, H.": ["bleeckerh_child.jpg", "bleeckerh_teen.jpg", "bleeckerh_young.jpg", "bleeckerh.PNG", "bleeckerh_old.jpg"],
      "Horace, Mann": ["horacemann_child.jpg", "horacemann_teen.jpg", "horacemann_young.jpg", "horacemann.PNG", "horacemann_old.jpg"],
      "Bancroft, George": ["bancroftgeorge_child.jpg", "bancroftgeorge_teen.jpg", "bancroftgeorge_young.jpg", "bancroftgeorge.PNG", "bancroftgeorge_old.jpg"],
      "Grant, Moses": ["grantmoses_child.jpg", "grantmoses_teen.jpg", "grantmoses_young.jpg", "grantmoses.PNG", "grantmoses_old.jpg"],
      "Peabody, Elizabeth Palmer": ["peabodyelizabethpalmer_child.jpg", "peabodyelizabethpalmer_teen.jpg", "peabodyelizabethpalmer_young.jpg", "peabodyelizabethpalmer.PNG", "peabodyelizabethpalmer_old.jpg"],
      "Woodbridge, William C.": ["woodbridgewilliamc_child.jpg", "woodbridgewilliamc_teen.jpg", "woodbridgewilliamc_young.jpg", "woodbridgewilliamc.PNG", "woodbridgewilliamc_old.jpg"],
      "Dana, Richard Henry": ["danarichardhenry_child.jpg", "danarichardhenry_teen.jpg", "danarichardhenry_young.jpg", "danarichardhenry.PNG", "danarichardhenry_old.jpg"],
      "Thacher, Samuel C.": ["thachersamuelc_child.jpg", "thachersamuelc_teen.jpg", "thachersamuelc_young.jpg", "thachersamuelc.PNG", "thachersamuelc_old.jpg"]
    },

    this.wikis = {
      "Channing, William Ellery": {"bio": "William Ellery Channing (April 7, 1780 – October 2, 1842) was the foremost Unitarian preacher...", "link": "https://en.wikipedia.org/wiki/William_Ellery_Channing", "birth": 1780, "death": 1842},
      "unknown": {"bio": "We could not find a Wikipedia article about this entity. Consider writing one if you know more!", "link": "https://en.wikipedia.org/wiki/Help:Your_first_article"},
      "Unitarians": {"bio": "Unitarianism (from Latin unitas 'unity, oneness', from unus 'one') is a Non-trinitarian Christi...", "link": "https://en.wikipedia.org/wiki/Unitarianism"},
      "Ellery, William": {"bio": "William Ellery (December 22, 1727 – February 15, 1820) was a signer of the United States Declar...", "link": "https://en.wikipedia.org/wiki/William_Ellery", "birth": 1727, "death": 1820},
      "Channing, William Francis": {"bio": "William Francis Channing (February 22, 1820 – March 20, 1901) was an American activist, electri...", "link": "https://en.wikipedia.org/wiki/William_Francis_Channing", "birth": 1820, "death": 1901},
      "Clay, Henry": {"bio": "Henry Clay Sr. (April 12, 1777 – June 29, 1852) was an American attorney and statesman who repr...", "link": "https://en.wikipedia.org/wiki/Henry_Clay", "birth": 1777, "death": 1852},
      "Dewey, Orville": {"bio": "Orville Dewey (March 28, 1794 – March 21, 1882) was an Unitarian ministerin the United States...", "link": "https://en.wikipedia.org/wiki/Orville_Dewey", "birth": 1794, "death": 1882},
      "Worcester, Samuel": {"bio": "Samuel Worcester (1 November 1770, in Hollis, New Hampshire – 7 June 1821, in Brainerd, Tenness...", "link": "https://en.wikipedia.org/wiki/Samuel_Worcester_(theologian)", "birth": 1770, "death": 1821},
      "Tuckerman, Joseph": {"bio": "Joseph Tuckerman (January 18, 1778 Boston – April 20, 1840 Havana) was a United States clergyma...", "link": "https://en.wikipedia.org/wiki/Joseph_Tuckerman", "birth": 1778, "death": 1840},
      "Aiken, Lucy": {"bio": "Lucy Aikin (6 November 1781 – 29 January 1864) was an English historical writer, biographer and...", "link": "https://en.wikipedia.org/wiki/Lucy_Aikin", "birth": 1781, "death": 1864},
      "Worcester, Noah": {"bio": "Noah Worcester (November 25, 1758 – October 31, 1837) was a Unitarian clergyman and a seminal f...", "link": "https://en.wikipedia.org/wiki/Noah_Worcester", "birth": 1758, "death": 1837},
      "Dwight, John S.": {"bio": "John Sullivan Dwight (May 13, 1813 – September 5, 1893) was a Unitarian minister, transcendenta...", "link": "https://en.wikipedia.org/wiki/John_Sullivan_Dwight", "birth": 1813, "death": 1893},
      "Vaughan, William": {"bio": "William Joseph Vaughan (14 February 1814 – 25 October 1902) was a British clergyman who held hi...", "link": "https://en.wikipedia.org/wiki/William_Vaughan_(bishop)", "birth": 1814, "death": 1902},
      "Bleecker, H.": {"bio": "Harmanus Bleecker (October 9, 1779 – July 19, 1849) was an attorney in Albany, New York...", "link": "https://en.wikipedia.org/wiki/Harmanus_Bleecker", "birth": 1779, "death": 1849},
      "Horace, Mann": {"bio": "Horace Mann (May 4, 1796 – August 2, 1859) was an American educational reformer and Whig politi...", "link": "https://en.wikipedia.org/wiki/Horace_Mann", "birth": 1796, "death": 1859},
      "Bancroft, George": {"bio": "George Bancroft (October 3, 1800 – January 17, 1891) was an American historian, statesman and D...", "link": "https://en.wikipedia.org/wiki/George_Bancroft", "birth": 1800, "death": 1891},
      "Grant, Moses": {"bio": "Moses Grant Jr. (July 25, 1785 - July 22, 1861) was a businessman born in Boston, Massachusetts...", "link": "https://en.wikipedia.org/wiki/Moses_Grant_Jr.", "birth": 1785, "death": 1861},
      "Peabody, Elizabeth Palmer": {"bio": "Elizabeth Palmer Peabody (May 16, 1804 – January 3, 1894) was an American educator who opened t...", "link": "https://en.wikipedia.org/wiki/Elizabeth_Peabody", "birth": 1804, "death": 1894},
      "Woodbridge, William C.": {"bio": "William Woodbridge (August 20, 1780 – October 20, 1861) was a U.S. statesman in the states of O...", "link": "https://en.wikipedia.org/wiki/William_Woodbridge", "birth": 1780, "death": 1861},
      "Loring, Ellis Gray": {"bio": "Ellis Gray Loring (April 14, 1803 - May 24, 1858) was an American attorney, abolitionist, and p...", "link": "https://en.wikipedia.org/wiki/Ellis_Gray_Loring", "birth": 1803, "death": 1858},
      "Dana, Richard Henry": {"bio": "Richard Henry Dana Jr. (August 1, 1815 – January 6, 1882) was an American lawyer and politician...", "link": "https://en.wikipedia.org/wiki/Richard_Henry_Dana_Jr.", "birth": 1815, "death": 1882},
      "Thacher, Samuel C.": {"bio": "Samuel Cooper Thacher (December 14, 1785 – January 2, 1818) was an American clergyman and libra...", "link": "https://en.wikipedia.org/wiki/Samuel_Cooper_Thacher", "birth": 1785, "death": 1818},
      "Channing, Lucy Ellery": {"bio": "Lucy Ellery Channing (September 21, 1752 – May 25, 1834) was the mother of William Ellery Chann...", "link": "https://www.wikidata.org/wiki/Q75568505", "birth": 1752, "death": 1834}
    };
  }


  init() {
    // Use "self" here because of context problems when this function is
    // passed as a callback
    self.setupFilters();
    self.changeData("all");
  }

  render() {
    this.data = this.sortNodes(this.data);
    this.numNodes = this.data["nodes"].length;

    // Calculate positions for a circle structure
    for (let i = 0; i < this.numNodes; i++) {
      // Taken from: http://bl.ocks.org/bycoffe/3404776
      let angle = (i / (this.numNodes/2)) * Math.PI; // Calculate the angle at which the element will be placed.
      this.data["nodes"][i]["x"] =  (this.radius * Math.cos(angle)) + (this.width/2); // Calculate the x position of the element.
      this.data["nodes"][i]["y"] = (this.radius * Math.sin(angle)) + (this.width/2); // Calculate the y position of the element.
    }

    this.setupYears();
    this.renderLetters();
  }

  setupFilters() {
    var that = this; // Helper to pass context

    this.filter_family.addEventListener("click", function() {
      that.changeData("family");
    });

    this.filter_groups.addEventListener("click", function() {
      that.changeData("groups");
    });

    this.filter_persons.addEventListener("click", function() {
      that.changeData("persons");
    });

    this.filterYearButton.addEventListener("click", function() {
      document.querySelector(".yearsSlider").value = document.querySelector(".yearsSlider").max;
      that.renderLettersByYear("");
    });

    this.filterPersonsButton.addEventListener("click", function() {
      that.renderLettersByPersons([]);
    });
  }

  // Function to retrieve the correctly aged image of a person
  getAgedPicture(person) {
    // Check if there are aged images at all
    if (Array.isArray(this.images[person])) {
      if (this.filterYear !== undefined) {
        // Unknown
        if (this.filterYear == 0 ) {
          return this.images[person][3];
        // Child
      } else if (this.filterYear < (this.wikis[person]["birth"] + 10)) {
          return this.images[person][0];
        // Teen
      } else if (this.filterYear < (this.wikis[person]["birth"] + 20)) {
          return this.images[person][1];
        // Young
      } else if (this.filterYear < (this.wikis[person]["birth"] + 35)) {
          return this.images[person][2];
        // Grown
      } else if (this.filterYear < (this.wikis[person]["birth"] + 55)) {
          return this.images[person][3];
        // Old
        } else {
          return this.images[person][4];
        }
      } else {
        return this.images[person][3];
      }
    } else {
      return this.images[person];
    }
  }

  // Function to color nodes according to content
  colorNodes(nodeText) {
    if (nodeText.includes("Channing") || nodeText.includes("Ellery,")) {
      return this.color_cyan;
    } else if (nodeText.includes(", ") || nodeText.includes("Dr. Sprague") || nodeText.includes("Miss Parsons") || nodeText.includes("Ware") || nodeText.includes("[Unknown]")) {
      return this.color_yellow;
    } else {
      return this.color_pink;
    }
  }

  // Check if current node has a connection
  findNodeConnection(node, links) {
    for (let i = 0; i < links.length; i++) {
      if ( (links[i]["source"][0] == node[0] && links[i]["source"][1] == node[1])
        || (links[i]["target"][0] == node[0] && links[i]["target"][1] == node[1])) {
          return "1";
      }
    }

    return "0.2";
  }

  sortNodes(data) {
    var tempPersons = [],
        tempGroups = [],
        tempFamily = [];

    for (let i = 0; i < data["nodes"].length; i++) {
      if (data["nodes"][i]["id"].includes("Channing") || data["nodes"][i]["id"].includes("Ellery,")) {
        tempFamily.push(data["nodes"][i]);
      } else if (data["nodes"][i]["id"].includes(", ") || data["nodes"][i]["id"].includes("Dr. Sprague") || data["nodes"][i]["id"].includes("Miss Parsons") || data["nodes"][i]["id"].includes("Ware") || data["nodes"][i]["id"].includes("[Unknown]")) {
        tempPersons.push(data["nodes"][i]);
      } else {
        tempGroups.push(data["nodes"][i]);
      }
    }

    data["nodes"] = tempFamily.concat(tempGroups, tempPersons);
    return data;
  }

  // Render Nodes
  renderNodes(links) {
    var that = this; // Helper to pass context functions to d3

    var nodes = this.svg.selectAll("circle")
        .data(this.data["nodes"])
        .enter()
          .append("circle") // One circle per element
            .attr("r", 4)
            .attr("cx", function (d, i) { return d.x; })
            .attr("cy", function (d, i) { return d.y; })
            .attr("fill", function (d, i) { return that.colorNodes(d.id); });

      nodes.attr("opacity", function (d, i) { return that.findNodeConnection([d.x, d.y], links);})
            .append("svg:title") // Make tooltip for each circle
              .text(function(d) { return d["id"]; });

      this.svg.selectAll("circle").on("click", function(e) {
        that.renderLettersByPersons([e["target"].querySelector("title").innerHTML]);
      });


      // Set animations
      this.svg.selectAll("circle").on("mouseover", function(e) {
        e["target"].setAttribute("r", "15");
        e["target"].setAttribute("stroke", "rgb(43, 49, 59)");
        e["target"].setAttribute("stroke-width", "15");
      });

      this.svg.selectAll("circle").on("mouseout", function(e) {
        e["target"].setAttribute("r", "4");
        e["target"].setAttribute("stroke", "transparent");
        e["target"].setAttribute("stroke-width", "0px");
      });

      this.renderPersons();
  }

  // Render Connections
  renderConnections() {
    var that = this, // Context helper
        links = [],
        tempPositions = {},
        linkGen = d3.linkVertical();

    for (let i = 0; i < this.data["nodes"].length; i++) {
      tempPositions[this.data["nodes"][i]["id"]] = {"x": this.data["nodes"][i]["x"], "y": this.data["nodes"][i]["y"]};
    }

    for (let i = 0; i < this.data["links"].length; i++) {
      if (this.data["links"][i]["Year"] == this.filterYear || this.filterYear == "" || this.filterYear == undefined) {
        // 1 Person filtered
        if (this.filterPersons.length == 1 && (this.filterPersons.includes(this.data["links"][i]["source"]) || this.filterPersons.includes(this.data["links"][i]["target"]))) {
          links.push({
            "source": [tempPositions[this.data["links"][i]["source"]]["x"], tempPositions[this.data["links"][i]["source"]]["y"]],
            "target": [tempPositions[this.data["links"][i]["target"]]["x"], tempPositions[this.data["links"][i]["target"]]["y"]],
            "addressee": this.data["links"][i]["target"],
            "creator": this.data["links"][i]["source"]
          });
        // Multiple persons filtered
        } else if (this.filterPersons.length > 1 && (this.filterPersons.includes(this.data["links"][i]["source"]) && this.filterPersons.includes(this.data["links"][i]["target"]))) {
          links.push({
            "source": [tempPositions[this.data["links"][i]["source"]]["x"], tempPositions[this.data["links"][i]["source"]]["y"]],
            "target": [tempPositions[this.data["links"][i]["target"]]["x"], tempPositions[this.data["links"][i]["target"]]["y"]],
            "addressee": this.data["links"][i]["target"],
            "creator": this.data["links"][i]["source"]
          });
        // No persons filtered
        } else if (this.filterPersons.length === 0) {
          links.push({
            "source": [tempPositions[this.data["links"][i]["source"]]["x"], tempPositions[this.data["links"][i]["source"]]["y"]],
            "target": [tempPositions[this.data["links"][i]["target"]]["x"], tempPositions[this.data["links"][i]["target"]]["y"]],
            "addressee": this.data["links"][i]["target"],
            "creator": this.data["links"][i]["source"]
          });
        }
      }
    }

    this.svg.selectAll("path")
        .data(links)
        .join("path")
          .attr("d", linkGen)
          .attr("class", "letter")
          .attr("fill", "none")
          .attr("stroke", "rgba(204, 204, 205, 0.3)")
          .attr("stroke-width", "3")
          .attr("stroke-linecap", "round")
          .attr("person1", function(d) { return d["addressee"]; })
          .attr("person2", function(d) { return d["creator"]; })
          .append("svg:title")
            .text(function(d, i) {
              return "Letters between " + d["creator"] + " and " + d["addressee"];
            });



    this.svg.selectAll("path").on("click", function(e) {
      that.renderLettersByPersons([e["target"].getAttribute("person1"), e["target"].getAttribute("person2")]);
    });

    // Set animations
    this.svg.selectAll("path").on("mouseover", function(e) {
      e["target"].setAttribute("stroke-width", "14");
    });

    this.svg.selectAll("path").on("mouseout", function(e) {
      e["target"].setAttribute("stroke-width", "3");
    });

    this.renderNodes(links); // render this second so nodes are on top
  }

  renderYear() {
    document.querySelector("#year").innerHTML = this.getYearDisplay();
  }

  getYearDisplay(year = this.filterYear) {
    if (year === "0") {
      return "18??";
    } else if (year === "" || year === undefined) {
      return "";
    } else {
      return year;
    }
  }

  renderLettersByYear(year) {
    if (year === undefined) {
      this.filterYearButton.innerHTML = this.getYearDisplay("");
    } else {
      this.filterYearButton.innerHTML = this.getYearDisplay(year);
    }
    this.renderLetters(this.filterPersons, year);
  }

  renderLettersByPersons(persons) {
    var that = this, // Context helper
        oldAndNewFilterEqual = false;

    if ((persons.length == this.filterPersons.length) && persons.length != 0) {
      let sort_newFilter = persons.sort(),
          sort_oldFilter = this.filterPersons.sort();

      oldAndNewFilterEqual = true; // Assume filters are equal until proven false in loop

      for (let i = 0; i < sort_newFilter.length; i++) {
        if (sort_newFilter[i] != sort_oldFilter[i]) {
          oldAndNewFilterEqual = false;
          break;
        }
      }
    }

    if (oldAndNewFilterEqual) {
      // Remove filter on second click on same filter
      // (aka if new filter is the same as the old one)
      this.renderLettersByPersons([]);
    } else {
      this.filterPersonsButton.innerHTML = persons.join(" & ");
      this.renderLetters(persons, this.filterYear);
      setTimeout(function() {
        that.renderTimeline();
      }, 220);
    }
  }

  renderLettersByBoth(persons, year) {
    if (year === undefined) {
      this.filterYearButton.innerHTML = this.getYearDisplay("");
    } else {
      this.filterYearButton.innerHTML = this.getYearDisplay(year);
    }
    this.filterPersonsButton.innerHTML = persons.join(" & ");
    this.filterYearButton.style.visibility = "visible";
    this.filterPersonsButton.style.visibility = "visible";
    this.renderLetters(persons, year);
    this.renderTimeline();
  }

  renderLetters(persons = [], year = "") {
    let that = this; // Context helper

    this.svg.selectAll("path")
        .attr("class", "letterOut");

    setTimeout(function() {
      that.svg.selectAll("circle").remove();
      that.svg.selectAll("path").remove();
      that.filterDocuments(persons, year);
    }, 200);
  }


  // Create year buttons
  setupYears() {
    var sliderContainer = document.querySelector(".yearsSliderInner"),
        yearsCount = {},
        years = [],
        that = this; // Helper to pass context functions to d3

    for (let i = 1780; i <= 1900; i++) {
      yearsCount[i] = 0;
    }

    // Reset slider (is buggy when filtering otherwise)
    sliderContainer.innerHTML = '<input class="slider yearsSlider" type="range" min="0" max="0" value="0" step="1">';

    var slider = document.querySelector(".yearsSlider");

    for (let i = 0; i < this.data["links"].length; i++) {
      if (this.data["links"][i]["Year"] in yearsCount) {
        yearsCount[this.data["links"][i]["Year"]] += 1;
      } else {
        yearsCount[this.data["links"][i]["Year"]] = 1;
      }
    }

    years = Array.from(Object.keys(yearsCount)).sort();
    this.allYears = years;
    slider.setAttribute("max", years.length);
    slider.setAttribute("value", years.length);
    slider.addEventListener("input", function() {that.renderLettersByYear(years[slider.value]);});
    slider.addEventListener("change", function() {that.renderLettersByYear(years[slider.value]);});

    this.showYearContent(yearsCount);
  }

  showYearContent(yearsCount) {
    var contentPerYear = Array.from(Object.values(yearsCount)),
        yearsPerYear = Array.from(Object.keys(yearsCount));

    d3.select(".yearsContentContainer")
        .selectAll("div")
        .remove();

    let years = d3.select(".yearsContentContainer")
        .selectAll("div")
        .data(contentPerYear)
        .enter()
        .append("div")
          .attr("class", "yearContent")
          .style("left", function(d, i) {
            if (i === 0) {
              return "0%";
            } else {
              return (((100 / contentPerYear.length) * 0.5) + ((100 / contentPerYear.length) * (i - 1))) + "%";
            }
          })
          .style("width", function(d, i) {
            if (i === 0) {
              // Transform first and last bars so that the handler
              // displays in the middle of each bar instead of between them
              return ((100 / contentPerYear.length) * 0.5) + "%";
            } else if (i === contentPerYear.length - 1) {
              return ((100 / contentPerYear.length) * 1.5) + "%";
            } else {
              return (100 / contentPerYear.length) + "%";
            }})
          .style("height", function(d, i) {
            // Exception for "Unknown year", because of confusingly high
            // amount compared to other years
            if (i === 0) {
              return "0px";
            } else {
              return (d * 5) + "px";
            }
          });

    let visibleYearLabelBefore = false;

    years.append("p").html(function(d, i) {

      if (d != 0 || ["0", "1798", "1803", "1819", "1828", "1842"].indexOf(yearsPerYear[i]) >= 0) {
        if (yearsPerYear[i] == 1842) {
          visibleYearLabelBefore = true;
          return "<b>Death in Bennington</b> " + yearsPerYear[i];
        } else if (yearsPerYear[i] == 1819) {
          visibleYearLabelBefore = true;
          return "<b>Sermon 'Unitarian Christianity'</b> " + yearsPerYear[i];
        //} else if (yearsPerYear[i] == 1820) {
        //  visibleYearLabelBefore = true;
        //  return "<b>Son Williams Birth</b> " + yearsPerYear[i];
        } else if (yearsPerYear[i] == 1803) {
          visibleYearLabelBefore = true;
          return "<b>Preacher in Boston</b> " + yearsPerYear[i];
        } else if (yearsPerYear[i] == 1828) {
          visibleYearLabelBefore = true;
          return "<b>Sermon 'Likeness to God'</b> " + yearsPerYear[i];
        } else if (yearsPerYear[i] == 1798) {
          visibleYearLabelBefore = true;
          return "<b>Graduation from Harvard</b> " + yearsPerYear[i];
        } else if (yearsPerYear[i] == 0) {
          visibleYearLabelBefore = true;
          return "Unknown";
        } else {
          if (visibleYearLabelBefore || yearsPerYear[i] == 1821 || yearsPerYear[i] == 1841) {
            visibleYearLabelBefore = false;
            return "";
          } else {
            visibleYearLabelBefore = true;
            return yearsPerYear[i];
          }
        }
      } else {
        visibleYearLabelBefore = false;
      }
    });
  }

  renderPersons() {
    var noImg = [],
        alreadyRenderedPersons = [],
        nodes = document.querySelectorAll("circle");

    if (this.filterYear == undefined || this.filterYear == "") {
      this.filterYear = this.allYears[document.querySelector(".yearsSlider").value];
    }

    this.personsContainer.innerHTML = "";

    // Render William Ellery Channing always
    this.renderPerson(0);

    // Render other currently active filtered persons always
    for (let i = 0; i < this.filterPersons.length; i++) {
      if (this.filterPersons[i] != "Channing, William Ellery") {
        this.renderPerson(0, this.filterPersons[i]);
        alreadyRenderedPersons.push(this.filterPersons[i]);
      }
    }

    for (let i = 1; i < nodes.length; i++) {
      // If currently visible and not already rendered
      if (nodes[i].getAttribute("opacity") == "1" && !alreadyRenderedPersons.includes(this.data["nodes"][i]["id"])) {
        // Render persons with image first
        if (this.data["nodes"][i]["id"] in this.images) {
          this.renderPerson(i);
        // Save persons without images for later
        } else {
          noImg.push(i);
        }
      }
    }

    // Render persons without image
    for (let i = 0; i < noImg.length; i++) {
      this.renderPerson(noImg[i]);
    }
  }

  renderPerson(i, id = "") {
    var that = this,
        name = id; // Context helper

    // If a person's name was transferred use that one,
    // if not, catch the name via the number
    if (name == "") {
      name = this.data["nodes"][i]["id"];
    }

    // If person is dead put a cross before the name
    if (name in this.wikis && (this.wikis[name]["death"] < this.filterYear)) {
      this.personTemplate.content.querySelector("h3").innerHTML = "&#128327; " + name + " (Deceased)";
    } else if (name in this.wikis && (this.wikis[name]["birth"] > this.filterYear)) {
      this.personTemplate.content.querySelector("h3").innerHTML = "* " + name + " (Unborn)";
    } else {
      this.personTemplate.content.querySelector("h3").innerHTML = name;
    }
    this.personTemplate.content.querySelector(".infoPerson").setAttribute("person-id", name);
    this.personTemplate.content.querySelector(".imageContainer").style.borderColor = this.colorNodes(name);

    if (name in this.images) {
      this.personTemplate.content.querySelector("img").setAttribute("src", "./src/img/persons/" + this.getAgedPicture(name));
      // If person is not alive darken the picture
      if (name in this.wikis && this.filterYear != 0 && (this.wikis[name]["death"] < this.filterYear || this.wikis[name]["birth"] > this.filterYear)) {
        this.personTemplate.content.querySelector("img").style.filter = "brightness(40%)";
      } else {
        this.personTemplate.content.querySelector("img").style.filter = "brightness(100%)";
      }
    } else {
      this.personTemplate.content.querySelector("img").setAttribute("src", "./src/img/persons/" + this.images["unknown"]);
    }

    if (name in this.wikis) {
      this.personTemplate.content.querySelector("p").innerHTML = this.wikis[name]["bio"];
      this.personTemplate.content.querySelector("p").innerHTML += " <a href='" + this.wikis[name]["link"] + "' target='_blank'>More at Wikipedia</a>";
    } else {
      this.personTemplate.content.querySelector("p").innerHTML = this.wikis["unknown"]["bio"];
      this.personTemplate.content.querySelector("p").innerHTML += " <a href='" + this.wikis["unknown"]["link"] + "' target='_blank'>Learn how</a>";
    }


    this.personsContainer.appendChild(document.importNode(personTemplate.content, true));
    document.querySelector('[person-id="' + name + '"] img').addEventListener("click", function() { that.renderLettersByPersons([name]); });
  }

  filterDocuments(persons = [], year = "") {
    var that = this, // Context helper
        docs = [],
        yearsContent = {};

    // Set filters
    this.filterPersons = persons;

    if (year == "") {
      this.filterYear = this.allYears[document.querySelector(".yearsSlider").value];
    } else {
      this.filterYear = year;
    }

    if (this.filterPersons.length == 0) {
      this.filterPersonsButton.style.visibility = "hidden";
    } else {
      this.filterPersonsButton.style.visibility = "visible";
    }

    if (this.filterYear == undefined || this.filterYear == "") {
      this.filterYearButton.style.visibility = "hidden";
    } else {
      this.filterYearButton.style.visibility = "visible";
    }

    this.documentsContainer.innerHTML = "";

    for (let i = 0; i < this.data["links"].length; i++) {
      if (this.data["links"][i]["Year"] == this.filterYear || this.filterYear == "" || this.filterYear == undefined) {
        // Two persons
        if ((this.filterPersons.length > 1 && (this.filterPersons.includes(this.data["links"][i]["source"]) &&
            this.filterPersons.includes(this.data["links"][i]["target"]))) ||
            // Only 1 person
            (this.filterPersons.length == 1 && (this.filterPersons.includes(this.data["links"][i]["source"]) ||
                this.filterPersons.includes(this.data["links"][i]["target"]))) ||
            // No persons
            this.filterPersons.length == 0) {

          this.documentTemplate.content.querySelector(".document").setAttribute("data-id", this.data["links"][i]["ID"]);
          this.documentTemplate.content.querySelector(".documentImage").setAttribute("title", this.data["links"][i]["Title"]);
          this.documentTemplate.content.querySelector(".document h3").innerHTML = this.data["links"][i]["source"] + " &rarr; " + this.data["links"][i]["target"];
          this.documentTemplate.content.querySelector(".document p").innerHTML = this.data["links"][i]["Title"];
          this.documentTemplate.content.querySelector(".documentImage").style.backgroundImage =  "url('./src/img/docs/" + this.data["links"][i]["ID"] + ".jpg')";

          this.documentsContainer.appendChild(document.importNode(documentTemplate.content, true));
          document.querySelector(".document[data-id='" + this.data["links"][i]["ID"] + "']").addEventListener("click", function() { showDocument(that.data["links"][i]["ID"]); });

          docs.push(this.data["links"][i]);
        }
      }
    }

    this.renderYear();
    this.renderConnections();
  }

  renderTimeline() {
    var yearsCount = {};

    for (let i = 1780; i <= 1900; i++) {
      yearsCount[i] = 0;
    }

    // Filter 1 person
    if (this.filterPersons.length == 1) {
      for (let k = 0; k < this.data["links"].length; k++) {
        if (this.filterPersons.includes(this.data["links"][k]["source"]) || this.filterPersons.includes(this.data["links"][k]["target"])) {
          if (this.data["links"][k]["Year"] in yearsCount) {
            yearsCount[this.data["links"][k]["Year"]] += 1;
          } else {
            yearsCount[this.data["links"][k]["Year"]] = 1;
          }
        } else {
          if (! (this.data["links"][k]["Year"] in yearsCount)) {
            yearsCount[this.data["links"][k]["Year"]] = 0;
          }
        }
      }
    // Filter multiple persons
    } else if (this.filterPersons.length > 1) {
      for (let k = 0; k < this.data["links"].length; k++) {
        if (this.filterPersons.includes(this.data["links"][k]["source"]) && this.filterPersons.includes(this.data["links"][k]["target"])) {
          if (this.data["links"][k]["Year"] in yearsCount) {
            yearsCount[this.data["links"][k]["Year"]] += 1;
          } else {
            yearsCount[this.data["links"][k]["Year"]] = 1;
          }
        } else {
          if (! (this.data["links"][k]["Year"] in yearsCount)) {
            yearsCount[this.data["links"][k]["Year"]] = 0;
          }
        }
      }
    // Filter no person
    } else {
      for (let i = 0; i < this.data["links"].length; i++) {
        if (this.data["links"][i]["Year"] in yearsCount) {
          yearsCount[this.data["links"][i]["Year"]] += 1;
        } else {
          yearsCount[this.data["links"][i]["Year"]] = 1;
        }
      }
    }

    this.showYearContent(yearsCount);
  }

  changeData(type) {

    if (type == "family" && this.filtered != type) {
      this.data = this.dataIngestor.getFamily();
      this.filter_family.style.opacity = "1";
      this.filter_groups.style.opacity = "0.5";
      this.filter_persons.style.opacity = "0.5";
      this.filtered = type;

    } else if (type == "persons" && this.filtered != type) {
      this.data = this.dataIngestor.getPersons();
      this.filter_persons.style.opacity = "1";
      this.filter_family.style.opacity = "0.5";
      this.filter_groups.style.opacity = "0.5";
      this.filtered = type;

    } else if (type == "groups" && this.filtered != type) {
      this.data = this.dataIngestor.getGroups();
      this.filter_groups.style.opacity = "1";
      this.filter_family.style.opacity = "0.5";
      this.filter_persons.style.opacity = "0.5";
      this.filtered = type;

    } else {
      this.data = this.dataIngestor.getAll();
      this.filtered = "all";

      for (let filter of this.filters) {
        filter.style.opacity = "1";
      }
    }

    this.render();
  }
}

export default Visualization;
