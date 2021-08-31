import Connector from "./Connector.js";

class ConnectorItems {

  constructor(include_filters) {
    this.BASE_URI = "https://api.lib.harvard.edu/v2/items";
    this.BASE_URI_DC = ".dc";
    this.BASE_URI_JSON = ".json";
    this.URI = "";

    this.JSON = "json";
    this.DC = "dc";

    this.last_request = "";
    this.include_filters = include_filters;
    this.limit = "250"; // maximum number supported by Harvard LibraryCloud is 250
    this.collectionId = "23"; // limit search to specific collection (23 = William Ellery Channing)

    this.con = new Connector();
  }

  change_format(format = "", serialization = "") {
    var new_uri = this.BASE_URI;

    if (format.toLowerCase() == this.DC) {
      new_uri += this.BASE_URI_DC;
    }

    if (serialization.toLowerCase() == this.JSON) {
      new_uri += this.BASE_URI_JSON;
    }

    this.URI = new_uri;
    return new_uri;
  }

  retrieve_search(url, callback) {
    // Default: first 10 items retrieved, 0 - 250 possible with parameter
    // https://api.lib.harvard.edu/v2/items?title=peanuts&limit=50
    // Pagination: https://api.lib.harvard.edu/v2/items?title=peanuts&start=100&limit=50

    // Cursor with nextCursor used for next page: https://api-qa.lib.harvard.edu/v2/items?title=peanuts&cursor=*&limit=50
    // e.g.nextCursor: https://api-qa.lib.harvard.edu/v2/items?title=peanuts&cursor=AoEyOTkwMDM3NTk4NzAwMjAzOTQx&limit=50
    // Con: Alphabetical ID, no relevancy sorting, returns nextCursor even if there is nothing left
    url += "&limit=250";

    if (this.collectionId != "") {
      url += "&collectionId=" + this.collectionId;
    }

    this.con.send_request(url, callback);
  }

  keyword_search(value, callback = this.print_callback) {
    // https://api.lib.harvard.edu/v2/items?q=(ethic*+OR+moral*)+AND+(bioengineering+OR+cloning)
    // Exact: https://api.lib.harvard.edu/v2/items?title_exact=Peanuts
    // contains number of matches, number of included records, page number of response, and matching records
    var cleaned_value = value.trim().replace(" ", "+"),
        url = this.URI + "?q=" + cleaned_value;
        // POSSIBLE SOLUTION FOR A "SET-WORKAROUND" TO STILL USE API FOR FILTERING
        //id_filter = [51612491, 952470667, 892575190],
        //url = this.URI + "?q=" + cleaned_value + "&identifier=" + id_filter[0] + " OR " + id_filter[1] + " OR " + id_filter[2] + "&limit=" + this.limit;

    if (this.include_filters) {
      url += "&facets=name,originPlace,subject";
      // originDate retrieves single year dates, does not make sense this way
      // facet_size does not seem to work, therefore workaround and reducing facets or at least the UI myself
    }

    this.last_request = url;
    this.retrieve_search(url, callback);
  }

  filter(value, field, callback = this.print_callback) {
    var url;

    if (value != "") {
      if (this.last_request.includes("&" + field + "=")) {
        let split_url = this.last_request.split("&" + field + "=");
        url = split_url[0] + "&" + field + "=" + value;
        // If there are other filters set behind
        if (split_url[1].includes("&")) {
          url += "&" + split_url[1].split("&")[1];
        }
      } else {
        url = this.last_request + "&" + field + "=" + value;
      }

      this.last_request = url;
      this.con.send_request(url, callback);

    // Remove filter if present
    } else if (this.last_request.includes("&" + field + "=")) {
      let split_url = this.last_request.split("&" + field + "=");
      url = split_url[0];
      // If there are other filters set behind
      if (split_url[1].includes("&")) {
        url += "&" + split_url[1].split("&")[1];
      }

      this.last_request = url;
      this.retrieve_search(url, callback);
    }
  }

  print_callback(result) {
    console.log(result);
  }
}

export default ConnectorItems;
