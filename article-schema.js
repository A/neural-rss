module.exports = {
  title: String
  , description: String
  , summary: String
  , link: String
  , origlink: String
  , date: Date
  , author: String
  , guid: { 
      type: String
    , unique: true
  }
  , comments: String
  , image: Object
  , categories: Array
  , source: Object
  , enclosures: Array
  , meta: Object
}