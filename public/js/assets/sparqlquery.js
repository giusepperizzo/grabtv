  (function(window, JQuery, undefined) {

  window.Sparql = function(params) {

    this.endpoint = params.endpoint;
    this.ns = params.ns;
    this.delimiter = params.delimiter || ":";

    this.nsInverse = _.reduce(this.ns, function(combine, uri, prefix) {
      combine[uri] = prefix;
      return combine;
    }, {});

    this.nsPart = _.reduce(this.ns, function(combine, uri, prefix) {
        return combine + "PREFIX " + prefix + ": <" +  uri + ">\n";
    }, "");
  };

  // returns the first object in the collection
  // whose value is true (object in this case)
  Sparql.prototype.getFirstResult = function(data) {
    return _.find(data, function(key, value) {
        return value;
      });
  };

  Sparql.prototype.uriToCurie = function(uri) {
    if (!uri) { return false; }
    var prefix = _.filter(this.nsInverse, function(prefix, ns) { return uri.indexOf(ns) === 0; })[0];
    return (prefix)
      ? prefix + this.delimiter + uri.replace(this.ns[prefix], "")
      : uri;
  };

  Sparql.prototype.makeQuery = function(query, callback) {

      // console.log(this.nsPart + query);

      var that = this;

      $.ajax({
        url: this.endpoint + encodeURIComponent( this.nsPart + query ),
        dataType: 'jsonp',
        jsonp: 'callback',      
        success: function( json ) {
          // console.log("ovo je stiglo:")
          // console.log(JSON.stringify(json));
          if ( json && json.results && json.results.bindings.length > 0 ) {
            callback(that.normalizeJSON(json.results.bindings));
          } else {
            console.warn( "empty result");
          }
        },
        error: function(err) { console.warn(err); }
      });
    };

    Sparql.prototype.normalizeJSON = function( data, defaultNS ) {

      return _.reduce(data, function(items, el) {
        var subj  = this.uriToCurie(el.s.value),
          pred  = this.uriToCurie(el.p.value),
          obj   = (el.o.type === "literal")
            ? el.o.value
            // : "<a href=\"" + el.o.value + "\">" + this.uriToCurie(el.o.value) + "</a>"
            : this.uriToCurie(el.o.value)

          prop = items[subj] || (items[subj] = {});

        if (prop[pred]) {
          if (!_.isArray(prop[pred])) {
            prop[pred] = [prop[pred]];
          }
          prop[pred].push(obj);
        } else {
          prop[pred] = obj;
        }
        
        // prop[pred].push(obj);

       //  items[subj] = prop;
        // (items[subj] || (items[subj] = {}))[pred] = obj;
        return items;
      }.bind(this), {});
    };

})(window, $);