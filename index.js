const fs = require("fs");
const path = require("path");
const getTranslateWord = require("@vitalets/google-translate-api");
const glob = require("glob")

class FormatKey {
  constructor(config) {
    this.state = {
      config,
      // dataStrRu: "",
      // dataStrEn: "",
      // arrWordRu: [],
      // arrWordEn: [],
      // arrWordTranslate: [],
      // arrWordCamelCase: [],
      // dataObjRu: {},
      // dataObjEn: {},
    };
  }

  async runChangeAttr() {
    this.state[this._getFilePath.name] = await this._getFilePath(config.folderPath, config.ex)
    this._loggerState()
  }


  async runWithEn() {
    this.state[this._setEntityFile.name + "Ru"] = await this._setEntityFile(this.state.config.pathToWriteRuFile);
    this.state[this._setEntityFile.name + "En"] = await this._setEntityFile(this.state.config.pathToWriteEnFile);
    this.state[this._setArrWord.name + "En"] = await this._setArrWord(this._setEntityFile.name + "En");
    this.state[this._setArrWord.name + "Ru"] = await this._setArrWord(this._setEntityFile.name + "Ru");
    this._loggerState();
    this._formatFile();
    this._setArrEnStrToCamelCase();
    this._keyOrganization();
    this._writeKeyFile();
  }

  async runWithoutEn() {
    this.state[this._setEntityFile.name + "Ru"] = await this._setEntityFile(this.data.config.pathToWriteRuFile);
    this._setArrWord();
    this._formatFile();
    await this._translate();
    this._setArrStrToCamelCase();
    this._keyOrganization();
    this._writeKeyFile();
  }

  async _setEntityFile(filePath) {
    const data = await new Promise((resolve, reject) => {
      try {
        fs.readFile(filePath, "utf8", (err, data) => {
          resolve(data);
        });
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });

    return data;
  }

  async _translate(dataKey, translateFrom, translateTo) {
    const arrReq = [];

    this.state.arrWordRu.forEach((el) => {
      const res = getTranslateWord(el, {
        from: translateFrom,
        to: translateTo,
      });
      arrReq.push(res);
    });

    const res = await Promise.all(arrReq);
    const arrWordTranslate = res.map((el) => el.text);
    this.state[dataKey || this._translate.name] = arrWordTranslate;
  }

  _setArrWord(str) {
    const data = str.split("\n")
    return data.filter((el) => el.length)
  }

  _formatFile() {
    this.state.arrWordRu = this.state.arrWordRu.filter(
      (el) => !el.includes("↓")
    );
  }

  _setArrStrToCamelCase() {
    const data = [];

    this.state.arrWordTranslate.forEach((el) => {
      const arr = el.split(" ");
      const newArr = arr.map((elem, index) => {
        if (index === 0) {
          return elem.toLowerCase();
        }
        return elem[0].toUpperCase() + elem.slice(1);
      });

      const strCamelCase = newArr.slice(0, 4).join("");
      data.push(strCamelCase);
    });

    this.state.arrWordCamelCase = data;
  }

  _setArrEnStrToCamelCase() {
    const data = [];

    this.state.arrWordEn.forEach((el) => {
      const arr = el.split(" ");
      const newArr = arr.map((elem, index) => {
        if (index === 0) {
          return elem.toLowerCase();
        }
        return elem[0].toUpperCase() + elem.slice(1);
      });

      const strCamelCase = newArr.slice(0, 4).join("");
      data.push(strCamelCase);
    });

    this.state.arrWordCamelCase = data;
  }

  _keyOrganization() {
    this.state.arrWordCamelCase.forEach((el, index) => {
      this.state.dataObjRu[el] = this.state.arrWordRu[index];
      this.state.dataObjEn[el] = this.state.arrWordEn[index];
    });
  }

  _writeKeyFile() {
    fs.writeFileSync(
      this.state.config.pathToWriteRuFile,
      JSON.stringify(this.state.dataObjRu)
    );
  }

  _writeFile(arrFile) {
    arrFile.forEach(item => {
      fs.writeFileSync(
        item.path,
        item.content
      );
    })
  }

  async _getFilePath(folderPath, ex) {
    const result = await new Promise(resolve => {
      glob(`**/*.${ex}`, {}, (err, files) => {
        try {
          console.log("reading file path...")
          resolve(files)
        } catch (err) {
          console.log(err)
        }
      })
    })

    return result
  }

  _getRegExpAttr(labelStartName) {
    const reg = new RegExp(`^(${labelStartName}=")(([а-яА-Я]+)(\s*)([а-яА-Я]+))+"$`,"g")
  }

  _loggerState() {
    console.log(this.state);
  }
}

const config = {
  pathToReadRuFile: "./in-testRu.txt",
  pathToReadEnFile: "./in-testEn.txt",
  pathToWriteRuFile: "./output-test-ru.json",
  pathToWriteEnFile: "./output-test-en.json",
  translateFrom: "ru",
  translateTo: "en",
  folderPath: "./src",
  ex: "vue",
};

const formatKey = new FormatKey(config);
formatKey.runWithEn();
