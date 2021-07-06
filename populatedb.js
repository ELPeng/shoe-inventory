#! /usr/bin/env node

console.log('This script populates some test shoes, brands,  and shoeinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Shoe = require('./models/shoe')
var Brand = require('./models/brand')
var ShoeInstance = require('./models/shoeinstance')


var mongoose = require('mongoose');
const shoe = require('./models/shoe');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var shoes = []
var brands = []
var shoeinstances = []

function brandCreate(name, cb) {
  var brand = new Brand({ name: name });
       
  brand.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Brand: ' + brand);
    brands.push(brand)
    cb(null, brand);
  }   );
}

function shoeCreate(name, brand, price, description, cb) {
  shoedetail = { 
    name: name,
    brand: brand,
    price: price,
    description: description,
  }
  if (brand != false) shoedetail.brand = brand
    
  var shoe = new Shoe(shoedetail);    
  shoe.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Shoe: ' + shoe);
    shoes.push(shoe)
    cb(null, shoe)
  }  );
}


function shoeInstanceCreate(shoe, size, cb){
    shoeinstancedetail = {
        shoe: shoe,
        size: size
    }
    var shoeinstance = new ShoeInstance(shoeinstancedetail);    
    shoeinstance.save(function (err) {
      if (err) {
        console.log('ERROR CREATING ShoeInstance: ' + shoeinstance);
        cb(err, null)
        return
      }
      console.log('New ShoeInstance: ' + shoeinstance);
      shoeinstances.push(shoeinstance)
      cb(null, shoe)
    }  );
}

function createBrands(cb){
    async.series([
        function(callback){
            brandCreate('Nike', callback)
        },
        function(callback){
            brandCreate('Adidas', callback)
        },
        function(callback){
            brandCreate('UnderArmor', callback)
        },
        function(callback){
            brandCreate('Puma', callback)
        },
    ], cb)
}

function createShoes(cb) {
    async.parallel([
        function(callback) {
          shoeCreate('Air Force 1', brands[0], 120, 'A classic designed by Bruce Kilgore and introduced in 1982, the Nike AF1 was the first basketball shoe to feature Nike Air technology. Over three decades since its first release, the Air Force 1 remains true to its roots while earning its status as a fashion staple for seasons to come', callback);
        },
        function(callback) {
            shoeCreate('Yeezy 350 v2', brands[1], 185, 'The YEEZY BOOST 350 V2features an upper composed of re-engineered Primeknit. The post-dyed monofilament side stripe is woven into the upper. Reflective threads are woven into the laces. The midsole utilizes adidas’ innovative BOOST™ technology.', callback);
          },
          function(callback) {
            shoeCreate('Space Hippie', brands[0], 130, 'Transforming waste into a radical expression of style, the Nike Space Hippie 01 brings you a bold, new look. Combining its super airy "Space Waste Yarn" upper with its ultra-soft Crater foam midsole, the design delivers a futuristic look that feels as light as mountain air. Made from at least 50% recycled materials, the sleek, track-inspired silhouette features a vibrant Swoosh and unique lacing system that minimize the production process. Lace up, salvage your world, live your dreams.', callback);
          },
          function(callback) {
            shoeCreate('Air Huarache', brands[0], 120, 'Built to fit your foot and designed for comfort, the Nike Air Huarache brings back a street-level favorite. Soft leather accents on the upper mix with super-breathable, perfectly shined neoprene-like fabric for easy styling. The low-cut collar and bootie-like construction keep it sleek. Its iconic heel clip and stripped away branding keep the early 90s look you love.', callback);
          }
        ],
        // optional callback
        cb);
}


function createShoeInstances(cb) {
    async.parallel([
        function(callback) {
          shoeInstanceCreate(shoes[0], 10, callback)
        }, 
        function(callback) {
            shoeInstanceCreate(shoes[0], 11, callback)
          },
          function(callback) {
            shoeInstanceCreate(shoes[0], 12, callback)
          },
          function(callback) {
            shoeInstanceCreate(shoes[1], 9, callback)
          },
          function(callback) {
            shoeInstanceCreate(shoes[1], 9, callback)
          },
          function(callback) {
            shoeInstanceCreate(shoes[2], 9, callback)
          }, 
          function(callback) {
              shoeInstanceCreate(shoes[2], 9, callback)
            },
            function(callback) {
              shoeInstanceCreate(shoes[2], 10, callback)
            },
            function(callback) {
              shoeInstanceCreate(shoes[2], 11.5, callback)
            },
            function(callback) {
              shoeInstanceCreate(shoes[3], 14, callback)
            }
        ],
        // Optional callback
        cb);
}

async.series([
    createBrands,
    createShoes,
    createShoeInstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('SHOEInstances: '+shoeinstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});

