const fs = require("fs");
const path = require("path");
const getTranslateWord = require("@vitalets/google-translate-api");
const glob = require("glob");

class FormatKey {
  constructor(config) {
    this.state = {
      config,
    };
  }

  async runChangeAttr() {
    this.state[this._getFilePath.name] = await this._getFilePath(
      config.folderPath,
      config.ex
    );
    this._loggerState();
  }

  async runWithEn() {
    this.state[this._setEntityFile.name + "Ru"] = await this._setEntityFile(
      this.state.config.pathToReadRuFile
    );
    this.state[this._setEntityFile.name + "En"] = await this._setEntityFile(
      this.state.config.pathToReadEnFile
    );
    this.state[this._setArrWord.name + "Ru"] = await this._setArrWord(
      this.state[this._setEntityFile.name + "Ru"]
    );
    this.state[this._setArrWord.name + "En"] = await this._setArrWord(
      this.state[this._setEntityFile.name + "En"]
    );
    this.state[this._formatFile.name + "En"] = this._formatFile(
      this.state[this._setArrWord.name + "En"]
    );
    this.state[this._formatFile.name + "Ru"] = this._formatFile(
      this.state[this._setArrWord.name + "Ru"]
    );
    this.state[this._setArrEnStrToCamelCase.name] =
      this._setArrEnStrToCamelCase(this.state[this._formatFile.name + "En"]);
    this.state[this._keyOrganization.name + "En"] = this._keyOrganization(
      this.state[this._setArrEnStrToCamelCase.name],
      this.state[this._formatFile.name + "En"]
    );
    this.state[this._keyOrganization.name + "Ru"] = this._keyOrganization(
      this.state[this._setArrEnStrToCamelCase.name],
      this.state[this._formatFile.name + "Ru"]
    );
    this._writeKeyFile(
      this.state.config.pathToWriteRuFile,
      this.state[this._keyOrganization.name + "Ru"]
    );
    this._writeKeyFile(
      this.state.config.pathToWriteEnFile,
      this.state[this._keyOrganization.name + "En"]
    );
  }

  async runWithoutEn() {
    this.state[this._setEntityFile.name + "Ru"] = await this._setEntityFile(
      this.state.config.pathToReadRuFile
    );
    this.state[this._setArrWord.name + "Ru"] = await this._setArrWord(
      this.state[this._setEntityFile.name + "Ru"]
    );
    this.state[this._formatFile.name + "Ru"] = this._formatFile(
      this.state[this._setArrWord.name + "Ru"]
    );
    this.state[this._translate.name] = await this._translate(
      this.state[this._formatFile.name + "Ru"],
      this.state.config.translateFrom,
      this.state.config.translateTo
    );
    this.state[this._setArrWord.name + "En"] = this.state[this._translate.name]
    this.state[this._setArrEnStrToCamelCase.name] =
      this._setArrEnStrToCamelCase(this.state[this._translate.name]);
    this.state[this._keyOrganization.name + "En"] = this._keyOrganization(
      this.state[this._setArrEnStrToCamelCase.name],
      this.state[this._setArrWord.name + "En"]
    );
    this.state[this._keyOrganization.name + "Ru"] = this._keyOrganization(
      this.state[this._setArrEnStrToCamelCase.name],
      this.state[this._formatFile.name + "Ru"],
    );
    this._writeKeyFile(
      this.state.config.pathToWriteRuFile,
      this.state[this._keyOrganization.name + "Ru"]
    );
    this._writeKeyFile(
      this.state.config.pathToWriteEnFile,
      this.state[this._keyOrganization.name + "En"]
    );
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

    dataKey.forEach((el) => {
      const res = getTranslateWord(el, {
        from: translateFrom,
        to: translateTo,
      });
      arrReq.push(res);
    });

    const res = await Promise.all(arrReq);
    const arrWordTranslate = res.map((el) => el.text);
    return arrWordTranslate;
  }

  _setArrWord(str) {
    const data = str.split("\n" || "\r");
    return data.filter((el) => el.length);
  }

  _formatFile(array) {
    const data = array.filter((el) => !el.includes("↓"));
    return data;
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

    return data;
  }

  _setArrEnStrToCamelCase(array) {
    const data = [];

    array.forEach((el) => {
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

    return data;
  }

  _keyOrganization(camelCaseArray, wordArray) {
    const dataObj = {};
    camelCaseArray.forEach((el, index) => {
      dataObj[el] = wordArray[index];
    });
    return dataObj;
  }

  _writeKeyFile(path, dataObj) {
    fs.writeFileSync(path, JSON.stringify(dataObj));
  }

  _writeVueFile(arrFile) {
    arrFile.forEach((item) => {
      fs.writeFileSync(item.path, item.content);
    });
  }

  async _getFilePath(folderPath, ex) {
    const result = await new Promise((resolve) => {
      glob(`**/*.${ex}`, {}, (err, files) => {
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

  _getRegExpAttr(labelStartName) {
    const reg = new RegExp(
      `^(${labelStartName}=")(([а-яА-Я]+)(\s*)([а-яА-Я]+))+"$`,
      "g"
    );
  }

  _loggerState() {
    console.log(this.state);
  }
}

const config = {
  pathToReadRuFile: "./input-global-ru.txt",
  pathToReadEnFile: "./input-global-en.txt",
  pathToWriteRuFile: "./output-test-ru.json",
  pathToWriteEnFile: "./output-test-en.json",
  translateFrom: "ru",
  translateTo: "en",
  // folderPath: "./src",
  // ex: "vue",
};

const formatKey = new FormatKey(config);
formatKey.runWithoutEn();
