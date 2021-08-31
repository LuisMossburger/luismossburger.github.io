class Connector {

  parse_json(data) {
    return json.loads(data.decode('utf8'));
  }

  make_request(url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4) {
        callback(this.responseText);
      }
    }
    xhttp.open("GET", url);
    xhttp.send();
  }

  send_request(url, callback) {
    try {
      this.make_request(url, callback);
    } catch (e) {
      console.log(e);
    }
  }
}

export default Connector;
