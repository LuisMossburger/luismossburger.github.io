class DataIngestor {

  constructor() {
    this.dataAll,
    this.dataFamily,
    this.dataGroups,
    this.dataPersons,
    this.callback;
  }

  readData(callback) {
     var that = this, // Helper for passing context
         xhttp = new XMLHttpRequest();

    this.callback = callback;

     xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          that.parseData(this.response);
        }
      };

      xhttp.open("GET", "./data/data.csv", true);
      xhttp.send();
  }

  parseData(data) {
    // Taken from https://gist.github.com/Jezternz/c8e9fafc2c114e079829974e3764db75
    const re = /(,|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^,\r\n]*))/gi;
    const result = [[]];
    let matches;

    while ((matches = re.exec(data))) {
      if (matches[1].length && matches[1] !== ',') result.push([])
      result[result.length - 1].push(
        matches[2] !== undefined ? matches[2].replace(/""/g, '"') : matches[3]
      )
    }

    result.pop(); // Delete last element, which is an empty row
    this.transformToObject(result);
  }

  transformToObject(csv) {
    var objectAll = {"nodes": [], "links": []},
        nodes = [],
        links = [],
        keys = [];

    for (let i = 0; i < csv.length; i++) {
      if (i === 0) {
        keys = csv[i]; // First line are the headers
        keys[2] = "source"; // Change to d3 vocabulary
        keys[7] = "target"; // Change to d3 vocabulary
      } else {
        // Add links
        let tempLinks = {};
        for (let k = 0; k < keys.length; k++) {
          tempLinks[keys[k]] = csv[i][k];
        }
        links.push(tempLinks);

        // Add nodes (creator & addressee)
        nodes.push(csv[i][2]);
        nodes.push(csv[i][7]);
      }
    }

    // Construct object
    links.forEach(function(link, key) {
      // Parse dates
      links[key]["Year"] = parseInt(links[key]["Year"]);
      if (isNaN(links[key]["Year"])) {
        links[key]["Year"] = 0;
      }

      // Handle unknown nodes
      if (link["source"] == "") {
        links[key]["source"] = "[Unknown]";
      }

      if (link["target"] == "") {
        links[key]["target"] = "[Unknown]";
      }
    });

    objectAll["links"] = links;

    nodes = Array.from(new Set(nodes)); // Make nodes unique
    nodes.forEach(function(node) {
      if (node == "") {
        objectAll["nodes"].push({"id": "[Unknown]"});
      } else {
        objectAll["nodes"].push({"id": node});
      }
    });

    // Set data
    this.dataAll = objectAll;
    this.dataFamily = this.setFamily();
    this.dataGroups = this.setGroups();
    this.dataPersons = this.setPersons();

    this.callback();
  }

  setFamily() {
    var objectFamily = {"nodes": [], "links": []},
        tempNodes = [],
        tempLinks = [];

    this.dataAll["nodes"].forEach(function(node) {
      if (node["id"].includes("Channing,") || node["id"].includes("Ellery,")) {
        tempNodes.push(node);
      }
    });

    this.dataAll["links"].forEach(function(link) {
      if ((link["source"].includes("Channing,") || link["source"].includes("Ellery,")) &&
          (link["target"].includes("Channing,") || link["target"].includes("Ellery,"))) {
        tempLinks.push(link);
      }
    });

    objectFamily["nodes"] = tempNodes;
    objectFamily["links"] = tempLinks;

    return objectFamily;
  }

  setPersons() {
    var objectPersons = {"nodes": [], "links": []},
        tempNodes = [],
        tempLinks = [];

    this.dataAll["nodes"].forEach(function(node) {
      if (node["id"].includes("Channing, William Ellery") ||
          (node["id"].includes(", ") && ! (node["id"].includes("Channing") || node["id"].includes("Ellery,") || node["id"].includes("White,"))) ||
          node["id"].includes("Dr. Sprague") || node["id"].includes("Ware") || node["id"].includes("[Unknown]")) {
        tempNodes.push(node);
      }
    });

    this.dataAll["links"].forEach(function(link) {

      // Exclude Ellery family members
      if (! (link["source"].includes("Ellery,") || link["target"].includes("Ellery,"))) {
        // Exclude letters from Channings to Channings
        if (! (link["source"].includes("Channing") && link["target"].includes("Channing"))) {
          // Only include persons
          if ((link["source"].includes(", ") || link["source"].includes("Dr. Sprague") ||
                link["source"].includes("Ware") || link["source"].includes("[Unknown]")) &&
              (link["target"].includes(", ") || link["target"].includes("Dr. Sprague") ||
                link["target"].includes("Ware") || link["target"].includes("[Unknown]"))) {
            // If a Channing is part of the letter communication, only accept the node if
            // it is William Ellery Channing himself (letters from Channing to Channing are already dropped here)
            if ( (link["source"].includes("Channing,") || link["target"].includes("Channing,"))
                  && (link["source"].includes("Channing, William Ellery") || link["target"].includes("Channing, William Ellery")) ) {
              tempLinks.push(link);
            }

            // If no Channing is present, push as well
            if ( !(link["source"].includes("Channing,") || link["target"].includes("Channing,")) ) {
              tempLinks.push(link);
            }
          }
        }
      }
    });

    objectPersons["nodes"] = tempNodes;
    objectPersons["links"] = tempLinks;

    return objectPersons;
  }

  setGroups() {
    var objectGroups = {"nodes": [], "links": []},
        tempNodes = [],
        tempLinks = [];

    this.dataAll["nodes"].forEach(function(node) {
      if (node["id"].includes("Unitarians") || node["id"].includes("Company") ||
          node["id"].includes("Committee") || node["id"].includes("Channing, William Ellery")) {
        tempNodes.push(node);
      }
    });

    this.dataAll["links"].forEach(function(link) {
      if ((link["source"].includes("Unitarians") || link["source"].includes("Company") ||
            link["source"].includes("Committee") || link["source"].includes("Channing, William Ellery")) &&
          (link["target"].includes("Unitarians") || link["target"].includes("Company") ||
            link["target"].includes("Committee") || link["target"].includes("Channing, William Ellery"))) {
        tempLinks.push(link);
      }
    });

    objectGroups["nodes"] = tempNodes;
    objectGroups["links"] = tempLinks;

    return objectGroups;
  }

  getAll() {
    return this.dataAll;
  }

  getGroups() {
    return this.dataGroups;
  }

  getFamily() {
    return this.dataFamily;
  }

  getPersons() {
    return this.dataPersons;
  }
}

export default DataIngestor;
