const fs = require("fs");
const path = require("path");
const glob = require("glob");
const enFile = require("./translate/global/en");
const ruFile = require("./translate/global/ru");

class ReplaceAttr {
  constructor(config) {
    this.state = {
      config,
      entityFileEn: enFile,
      entityFileRu: ruFile,
      entityNormalize: {},
      arrFilePath: [],
      fileEntity: "",
      arrMatch: [],
      fileEntityOutput: "",
      noTranslate: {}
    };
  }

  async runChangeAttr() {
    this.state.entityNormalize = this._normalize(this.state.entityFileRu);
    this.state.arrFilePath = await this._getFilePath(this.state.config.folderPath, this.state.config.ex);

    this.state.arrFilePath.forEach((pathName, index) => {

      this.state.fileEntity = this._getEntityFile(pathName);
      this.state.fileEntityOutput = this._getEntityFile(pathName);

      const reg = new RegExp(`(\\s${this.state.config.attrName}=")([а-яА-Я]+\\s*)+(")`, "gim");

      this.state.arrMatch = this.state.fileEntity.match(reg);


      if (this.state.arrMatch) {
        console.log("find match attr");
        this._setFileEntityOutput();

        this._writeFile([{
          path: "./noTranslate.json",
          content: JSON.stringify(this.state.noTranslate)
        }]);
      }

      fs.mkdirSync(path.dirname(`./build/${pathName.slice(6)}`), { recursive: true });
      fs.writeFileSync(`./build/${pathName.slice(6)}`, this.state.fileEntityOutput);
    });
  }

  async runChangeText() {
    this.state.entityNormalize = this._normalize(this.state.entityFileRu);
    this.state.arrFilePath = await this._getFilePath(this.state.config.folderPath, this.state.config.ex);

    this.state.arrFilePath.forEach((pathName, index) => {

      this.state.fileEntity = this._getEntityFile(pathName);
      this.state.fileEntityOutput = this._getEntityFile(pathName);

      // const reg = new RegExp('(>)+\s+([а-яА-Я]+\s*)+(<)',"gim")

      this.state.arrMatch = this.state.fileEntity.match(/(>)+\s+([а-яА-Я]+\s*)+(<)/gim);

      if (this.state.arrMatch) {

        this._setFileEntityOutputText();

        this._writeFile([{
          path: "./noTranslate.json",
          content: JSON.stringify(this.state.noTranslate)
        }]);
      }

      fs.mkdirSync(path.dirname(`./build/${pathName.slice(6)}`), { recursive: true });
      fs.writeFileSync(`./build/${pathName.slice(6)}`, this.state.fileEntityOutput);
    });
  }

  _setFileEntityOutput() {
    this.state.arrMatch.forEach(mat => {
      const wordRu = mat.match(/([а-яА-Я]+\s*)+/)[0];
      const wordRuTranslate = this.state.entityNormalize[wordRu];

      if (wordRuTranslate) {
        console.log("find translate");
        this.state.fileEntityOutput = this._getReplacedAttr(this.state.fileEntityOutput, this.state.config.attrName, wordRu, `$t('global.${wordRuTranslate}')`);
      } else {
        this.state.noTranslate[wordRu] = "";
      }
    });
  }

  _setFileEntityOutputText() {
    this.state.arrMatch.forEach(mat => {
      const wordRu = mat.match(/([а-яА-Я]+\s*)+/)[0].trimEnd();
      const wordRuTranslate = this.state.entityNormalize[wordRu];

      if (wordRuTranslate) {
        console.log("find translate");
        this.state.fileEntityOutput = this._getReplacedText(this.state.fileEntityOutput, wordRu, `$t('global.${wordRuTranslate}')`);
      } else {
        this.state.noTranslate[wordRu] = "";
      }
    });
  }

// /(>)\s*([а-яА-Я]+\s*)+(<)/gmi - находит совпадения по руссим словам внутри "><"
// /(>)+(\s*)+(.+)+(\s*)(<)/gmi - разбивает на правильные группы предшествующий матч

  _getReplacedAttr(fileEntity, attrName, wordReplace, replaceValue) {
    function replacer(match, p1, p2, p3, p4, payload) {
      return `${p1}:${p2}${payload}${p4}`;
    }

    const regExp = new RegExp(`(\\s)(${attrName}=")(${wordReplace})(")`);

    return fileEntity.replace(regExp, (match, p1, p2, p3, p4) => replacer(match, p1, p2, p3, p4, replaceValue));
  }

  _getReplacedText(fileEntity, wordReplace, replaceValue) {
    function replacer(match, p1, p2, p3, p4, p5, payload) {
      return `${p1}${p2}{{ ${payload} }}${p4}${p5}`;
    }

    const regExp = new RegExp(`(>)+(\\s+)+(${wordReplace})+(\\s+)+(<)`, "gim");

    return fileEntity.replace(regExp, (match, p1, p2, p3, p4, p5) => replacer(match, p1, p2, p3, p4, p5, replaceValue));
  }

  _getEntityFile(filePath) {
    try {
      return fs.readFileSync(filePath, "utf8");
    } catch (err) {
      console.error(err);
    }
  }

  async _getFilePath(folderPath, ex) {
    const result = await new Promise((resolve) => {
      glob(`./${folderPath}/**/*.${ex}`, {}, (err, files) => {
        try {
          console.log("reading file path...");
          resolve(files);
        } catch (err) {
          console.log(err);
        }
      });
    });

    return result;
  }

  _writeFile(arrFile) {
    arrFile.forEach((item) => {
      fs.writeFileSync(item.path, item.content);
    });
  }

  _normalize(ruKeys) {
    const dataObj = {};
    for (const elem in ruKeys) {
      dataObj[ruKeys[elem]] = elem;
    }
    return dataObj;
  }

  _loggerState() {
    console.log(this.state);
  }
}

const replaceAttr = new ReplaceAttr(
  {
    folderPath: "src",
    ex: "vue",
    attrName: "title"
  }
);

replaceAttr.runChangeText();
