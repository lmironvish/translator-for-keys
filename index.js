const fs = require("fs")
const getTranslateWord = require("@vitalets/google-translate-api")
const ruFile = require("./newNoTranslate.js")

class FormatKey {
  constructor(config) {
    this.state = {
      config,
      translateObj: {},
    }
  }

  async runWithEn() {
    this.state["entityFileRu"] = await this._getEntityFile(
      this.state.config.pathToReadRuFile
    )

    this.state["entityFileEn"] = await this._getEntityFile(
      this.state.config.pathToReadEnFile
    )

    this.state["arrWordRu"] = await this._setArrWord(this.state["entityFileRu"])

    this.state["arrWordEn"] = await this._setArrWord(this.state["entityFileEn"])

    this.state["formatFileEn"] = this._formatFile(this.state["arrWordEn"])

    this.state["formatFileRu"] = this._formatFile(this.state["arrWordRu"])

    this.state["arrEnStrToCamelCase"] = this._setArrEnStrToCamelCase(
      this.state["formatFileEn"]
    )

    this.state["keyOrganizationEn"] = this._keyOrganization(
      this.state["arrEnStrToCamelCase"],
      this.state["formatFileEn"]
    )

    this.state["keyOrganizationRu"] = this._keyOrganization(
      this.state["arrEnStrToCamelCase"],
      this.state["formatFileRu"]
    )

    this._writeKeyFile(
      this.state.config.pathToWriteRuFile,
      this.state["keyOrganizationRu"]
    )

    this._writeKeyFile(
      this.state.config.pathToWriteEnFile,
      this.state["keyOrganizationEn"]
    )
  }

  async runWithoutEn() {
    this.state["setEntityFileRu"] = await this._getEntityFile(
      this.state.config.pathToReadRuFile
    )

    this.state["arrWordRu"] = await this._setArrWord(this.state["entityFileRu"])

    this.state["formatFileRu"] = this._formatFile(this.state["setArrWordRu"])

    this.state["translate"] = await this._translate(
      this.state["formatFileRu"],
      this.state.config.translateFrom,
      this.state.config.translateTo
    )

    this.state["arrWordEn"] = this.state["translate"]
    this.state["arrEnStrToCamelCase"] = this._setArrEnStrToCamelCase(
      this.state["translate"]
    )

    this.state["keyOrganizationEn"] = this._keyOrganization(
      this.state["arrEnStrToCamelCase"],
      this.state["arrWordEn"]
    )

    this.state["keyOrganizationRu"] = this._keyOrganization(
      this.state["arrEnStrToCamelCase"],
      this.state["formatFileRu"]
    )

    this._writeKeyFile(
      this.state.config.pathToWriteRuFile,
      this.state["keyOrganizationRu"]
    )

    this._writeKeyFile(
      this.state.config.pathToWriteEnFile,
      this.state["keyOrganizationEn"]
    )
  }

  async runJS(translateObj) {
    this.state["setEntityFileRu"] = translateObj

    this.state["arrWordRu"] = this._setArrKeysFromFile(this.state["setEntityFileRu"])

    this.state["translate"] = await this._translate(
      this.state["arrWordRu"],
      this.state.config.translateFrom,
      this.state.config.translateTo
    )

    this.state["arrWordEn"] = this.state["translate"]

    this.state["arrCamelCase"] = this._setArrEnStrToCamelCase(
      this.state["translate"]
    )

    this.state["keyOrganizationEn"] = this._keyOrganization(
      this.state["arrCamelCase"],
      this.state["translate"]
    )

    this.state["keyOrganizationRu"] = this._keyOrganization(
      this.state["arrCamelCase"],
      this.state["arrWordRu"]
    )

    this._writeKeyFile(
      this.state.config.pathToWriteRuFile,
      this.state["keyOrganizationRu"]
    )

    this._writeKeyFile(
      this.state.config.pathToWriteEnFile,
      this.state["keyOrganizationEn"]
    )
  }

  _setArrKeysFromFile(dataObj) {
    return Object.keys(JSON.parse(JSON.stringify(dataObj)))
  }

  _getEntityFile(filePath) {
    try {
      return fs.readFileSync(filePath, "utf8")
    } catch (err) {
      console.error(err)
    }
  }

  async _translate(dataKey, translateFrom, translateTo) {
    const arrReq = []

    dataKey.forEach((el) => {
      const res = getTranslateWord(el, {
        from: translateFrom,
        to: translateTo,
      })
      arrReq.push(res)
    })

    const res = await Promise.all(arrReq)
    const arrWordTranslate = res.map((el) => el.text)
    return arrWordTranslate
  }

  _setArrWord(str) {
    const data = str.split("\n")
    return data.filter((el) => el.length)
  }

  _setJSArrWord(dataObj) {
    const data = Object.values(JSON.parse(JSON.stringify(dataObj)))
    return data
  }

  _formatFile(array) {
    const data = array.filter((el) => !el.includes("???"))
    return data
  }

  _setArrEnStrToCamelCase(array) {
    const data = []

    array.forEach((el) => {
      const arr = el.split(" ")
      const newArr = arr.map((elem, index) => {
        if (index === 0) {
          return elem.toLowerCase()
        }
        return elem[0].toUpperCase() + elem.slice(1)
      })

      const strCamelCase = newArr.slice(0, 4).join("")
      data.push(strCamelCase)
    })

    return data
  }

  _keyOrganization(camelCaseArray, wordArray) {
    const dataObj = {}
    camelCaseArray.forEach((el, index) => {
      dataObj[el] = wordArray[index]
    })
    return dataObj
  }

  _writeKeyFile(path, dataObj) {
    fs.writeFileSync(path, JSON.stringify(dataObj))
  }

  _loggerState() {
    console.log(this.state)
  }
}

const config = {
  pathToReadRuFile: "./input-global-ru.txt",
  pathToReadEnFile: "./input-global-en.txt",
  pathToWriteRuFile: "./output-newNoTranslate-ru.js",
  pathToWriteEnFile: "./output-newNoTranslate-en.js",
  translateFrom: "ru",
  translateTo: "en",
  folderPath: "./src",
  ex: "vue",
}

const formatKey = new FormatKey(config)
formatKey.runJS(ruFile)
