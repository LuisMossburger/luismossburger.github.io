import Connector from "./Connector.js";

class ConnectorCollections {

  constructor() {
    this.BASE_URI = "https://api.lib.harvard.edu/v2/collections";
    this.con = new Connector();
  }

  retrieve_all_collections(limit = 10) {
    var url = this.BASE_URI + "?limit=" + limit;
    this.con.send_request(url, this.print_callback);
  }

  retrieve_collection(id = 1) {
    // RETURNS 500 ERROR
    var url = this.BASE_URI + "/" + id;
    this.con.send_request(url, this.print_callback);
  }

  retrieve_collection_items(id = 1) {
    var url = this.BASE_URI + "/" + id + "/items";
    this.con.send_request(url, this.print_callback);
  }

  print_callback(result) {
    console.log(result);
  }
}

export default ConnectorCollections;
