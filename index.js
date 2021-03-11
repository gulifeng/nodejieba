var binary = require('node-pre-gyp');
var path = require('path');
var binding_path = binary.find(path.resolve(path.join(__dirname, './package.json')));
var nodejieba = require(binding_path);
var basePath = process.pkg ? process.cwd() : __dirname
var isDictLoaded = false;
console.log(basePath)
var exports = {
  DEFAULT_DICT: basePath + "/dict/jieba.dict.utf8",
  DEFAULT_HMM_DICT: basePath + "/dict/hmm_model.utf8",
  DEFAULT_USER_DICT: basePath + "/dict/user.dict.utf8",
  DEFAULT_IDF_DICT: basePath + "/dict/idf.utf8",
  DEFAULT_STOP_WORD_DICT: basePath + "/dict/stop_words.utf8",

  load: function (dictJson) {
    if (!dictJson) {
      dictJson = {};
    }
    dict = dictJson.dict || exports.DEFAULT_DICT;
    hmmDict = dictJson.hmmDict || exports.DEFAULT_HMM_DICT;
    userDict = dictJson.userDict || exports.DEFAULT_USER_DICT;
    idfDict = dictJson.idfDict || exports.DEFAULT_IDF_DICT;
    stopWordDict = dictJson.stopWordDict || exports.DEFAULT_STOP_WORD_DICT;

    isDictLoaded = true;
    return nodejieba.load(dict, hmmDict, userDict, idfDict, stopWordDict);
  }
};

function wrapWithDictLoad(functName) {
  var someFunct = nodejieba[functName];
  exports[functName] = function () {
    if (!isDictLoaded) {
      exports.load();
    }
    return someFunct.apply(this, arguments);
  }
}

wrapWithDictLoad("cut");
wrapWithDictLoad("cutAll");
wrapWithDictLoad("cutHMM");
wrapWithDictLoad("cutForSearch");
wrapWithDictLoad("cutSmall");
wrapWithDictLoad("tag");
wrapWithDictLoad("extract");
wrapWithDictLoad("insertWord");

module.exports = exports;
