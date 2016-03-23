// use https://regex101.com/ for testing

var jsonfile = require('jsonfile');
var _ = require('lodash');


var fileIn = './html.json';
var fileOut = './html-formatted.json';

// utils
function getSentencesFromString(str) {
  var regex, arr;
  // get sentences
  regex = /\n|([^\r\n.!?]+([.!?]+|$))/gim;
  arr = str.match(regex).map(_.trim);
  return arr;
}

function getInitialCapsGroupsFromString(str) {
  var regex, arr;
  // get groups of words with initialCaps first word
  regex = /([A-Z][a-z\s]+)/g;
  arr = str.match(regex).map(_.trim);
  return arr;
}

// http://stackoverflow.com/questions/20965477/how-can-i-extract-certain-html-tags-e-g-ul-using-regex-with-preg-match-all-in
function getArrayOfOrderedLists(str) {
  var regex, arr;
  regex = /<ol[^>]*>(.*?)<\/ol>/g;
  arr = str.match(regex).map(_.trim);
  return arr;
}

function getArrayOfListItems(str) {
  var regex, arr;
  regex = /<li[^>]*>(.*?)<\/li>/g;
  arr = str.match(regex).map(_.trim);
  return arr;
}

jsonfile.readFile(fileIn, function(err, obj) {
  if(err){
    console.error(err);
    return;
  }

  var formatted = {};

  // format a paragraph into sentences
  formatted.sentences = getSentencesFromString(obj.paragraph1);

  // format a paragraph into groups of initial caps
  formatted.initialCapsGroups = getInitialCapsGroupsFromString(obj.paragraph2);

  // get arrays of contents from ordered lists
  var ols = getArrayOfOrderedLists(obj.orderedListAsString);
  formatted.lists = ols.map(function(ol){
    return getArrayOfListItems(ol);
  })

  //write out
  jsonfile.writeFile(fileOut, formatted, function (err) {
    if(err){
      console.error(err)
    }
    console.log('done!')
  })
})