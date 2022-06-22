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
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
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
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
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


// fs.readdir(exports.dataDir, (err, files) => {
//   if (err) {
//     console.log('uh oh');
//   } else {
//     var mapped = _.map(files, (id) => {
//       return fs.readFile(exports.dataDir + '/' + id, 'utf8', (err, data) => {
//         if (err) {
//           console.log('err');
//         } else {
//           return data;
//         }
//       });
//       console.log('mapppped', mapped);
//       callback(null, mapped);
//     });
//   }
// });
