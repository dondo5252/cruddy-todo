const fs = require('fs');// Read files Create files Update files Delete files Rename files
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  //rewrite this function to us file-system module
  //and save things permanetly as opped to just in memory
  var id = counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log('err');
    } else {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
        if (err) {
          throw ('error writing counter');
        } else {
          callback(null, {id, text});
        }
      });
    } // end of fs.writeFile
  });
};


/*
    _.map([collection of texts], function(eachText, id) {

    } )
*/
exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log('uh oh');
    } else {
      var mapped = _.map(files, (id) => {
        id = path.basename(id, '.txt');
        var obj = {};
        obj.id = id;
        obj.text = id;
        return obj;
      });

      callback(null, mapped);
    }
  });


};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
  fs.readFile(exports.dataDir + '/' + id + '.txt', 'utf8', (err, data) => {
    if (err) {
      callback(new Error('Sorry not found'));
    } else {
      var obj = {};
      obj.id = id;
      obj.text = data;
      callback(null, obj);
    }
  });
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }

  fs.exists(exports.dataDir + '/' + id + '.txt', (exists) => {
    if (exists) {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          if (id) {
            var obj = {};
            obj.id = id;
            obj.text = text;
            callback(null, obj);
          }
        }
      });
    } else {
      callback(new Error('Does not exist, Error'));
    }
  });
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};



