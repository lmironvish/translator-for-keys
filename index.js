const fs = require("fs");
const path = require("path");
const getTranslateWord = require("@vitalets/google-translate-api");
const glob = require("glob");

class FormatKey {
  constructor(config) {
    this.state = {
      config,
      entityFileEn: {
        academyAdministrator: "Academy Administrator",
        acceptedByMember: "Accepted by member",
        additionalStatus: "Additional status",
        administrator: "Administrator",
        allowTestsForEveryone: "Allow tests for everyone",
        answer: "Answer",
      },
      entityFileRu: {
        academyAdministrator: "Руководитель продаж",
        acceptedByMember: "Принято участником",
        additionalStatus: "Доп.статус",
        administrator: "Суперадминистратор",
        allowTestsForEveryone: "Разрешение тестов всем",
        answer: "Ответ",
      },
      entityNormalize: {
        "Руководитель продаж": "academyAdministrator",
        "Принято участником": "acceptedByMember",
        "Доп.статус": "additionalStatus",
        "Суперадминистратор": "administrator",
        "Разрешение тестов всем": "allowTestsForEveryone",
        "Ответ": "answer",
      },
      attr: {
        arrFilePath: [],
        fileEntity: "",
        arrMatch: [],
        fileEntityOutput: "",
      },
    };
  }

  async runChangeAttr(settings) {
    this.state.attr.arrFilePath = await this._getFilePath(config.folderPath, config.ex)

    this.state.attr.arrFilePath.forEach(pathName => {
      this.state.attr.fileEntity = this._getEntityFile(pathName)
      this.state.attr.fileEntityOutput = this._getEntityFile(pathName)
      this.state.attr.arrMatch = this.state.attr.fileEntity.match(this._getRegExpAttr(settings.attrName))
      this._setFileEntityOutput(settings)
    })

    this._loggerState()
  }

  _setFileEntityOutput(settings) {
    this.state.attr.arrMatch.forEach(mat => {
        const wordRu = mat.search(/([а-яА-Я]+\s*[а-яА-Я]+)+/)
        const wordRuTranslate = this.state.entityNormalize[wordRu]

        if(wordRuTranslate) {
          this.state.attr.fileEntityOutput = this._getReplacedString(this.state.attr.fileEntityOutput, settings.attrName, `$t(global.${wordRuTranslate})`)
        }
    })
  }

  async runWithEn() {
    this.state["entityFileRu"] = await this._getEntityFile(
      this.state.config.pathToReadRuFile
    );
    this.state["entityFileEn"] = await this._getEntityFile(
      this.state.config.pathToReadEnFile
    );
    this.state["arrWordRu"] = await this._setArrWord(
      this.state["entityFileRu"]
    );
    this.state["arrWordEn"] = await this._setArrWord(
      this.state["entityFileEn"]
    );
    this.state["formatFileEn"] = this._formatFile(
      this.state["arrWordEn"]
    );
    this.state["formatFileRu"] = this._formatFile(
      this.state["arrWordRu"]
    );
    this.state["arrEnStrToCamelCase"] =
      this._setArrEnStrToCamelCase(this.state["formatFileEn"]);
    this.state["keyOrganizationEn"] = this._keyOrganization(
      this.state["arrEnStrToCamelCase"],
      this.state["formatFileEn"]
    );
    this.state["keyOrganizationRu"] = this._keyOrganization(
      this.state["arrEnStrToCamelCase"],
      this.state["formatFileRu"]
    );
    this._writeKeyFile(
      this.state.config.pathToWriteRuFile,
      this.state["keyOrganizationRu"]
    );
    this._writeKeyFile(
      this.state.config.pathToWriteEnFile,
      this.state["keyOrganizationEn"]
    );
  }

  async runWithoutEn() {
    this.state["setEntityFileRu"] = await this._getEntityFile(
      this.state.config.pathToReadRuFile
    );
    this.state["arrWordRu"] = await this._setArrWord(
      this.state["entityFileRu"]
    );
    this.state["formatFileRu"] = this._formatFile(
      this.state["setArrWordRu"]
    );
    this.state["translate"] = await this._translate(
      this.state["formatFileRu"],
      this.state.config.translateFrom,
      this.state.config.translateTo
    );
    this.state["arrWordEn"] = this.state["translate"]
    this.state["arrEnStrToCamelCase"] =
      this._setArrEnStrToCamelCase(this.state["translate"]);
    this.state["keyOrganizationEn"] = this._keyOrganization(
      this.state["arrEnStrToCamelCase"],
      this.state["arrWordEn"]
    );
    this.state["keyOrganizationRu"] = this._keyOrganization(
      this.state["arrEnStrToCamelCase"],
      this.state["formatFileRu"],
    );
    this._writeKeyFile(
      this.state.config.pathToWriteRuFile,
      this.state["keyOrganizationRu"]
    );
    this._writeKeyFile(
      this.state.config.pathToWriteEnFile,
      this.state["keyOrganizationEn"]
    );
  }

  _getReplacedAttr(fileEntity, attrName, replaceValue) {
    function replacer(match, p1, p2, p3, p4, payload) {
      return `:${p1}${payload}${p4}`
    }

    const regExp = new RegExp(`(${attrName}=")(([а-яА-Я]+\s*)*)(")`)

    return fileEntity.replace(this._getRegExpAttr(attrName), (match, p1, p2, p3, p4) => replacer(match, p1, p2, p3, replaceValue))
  }

  _getEntityFile(filePath) {
      try {
        return fs.readFileSync(filePath, "utf8");
      } catch (err) {
        console.error(err);
      }
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
    return new RegExp(`(${labelStartName}=")([а-яА-Я]+\s*[а-яА-Я]+)+(")`,"gim")
  }

  _getRegExpValue() {
    return new RegExp(`\w+="([а-яА-Я]+s*[а-яА-Я]+)+`)
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
  folderPath: "./src",
  ex: "vue",
};

const formatKey = new FormatKey(config);
formatKey.runChangeAttr({
  attrName: "label"
});

