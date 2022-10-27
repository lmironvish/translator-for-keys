const fs = require("fs")
const getTranslateWord = require("@vitalets/google-translate-api")

class FormatKey {
  constructor(config) {
    this.state = {
      config,
      dataStrRu: "",
      dataStrEn: "",
      arrWordRu: [],
      arrWordEn: [],
      arrWordTranslate: [],
      arrWordCamelCase: [],
      dataObjRu: {},
      dataObjEn: {},
    }
  }
  async runWithEn() {
    await this._setEntityRuFile()
    await this._setEntityEnFile()
    this._setArrWord()
    this._formatFile()
    this._setArrEnStrToCamelCase()
    this._keyOrganization()
    this._writeRuFile()
    this._writeEnFile()
  }

  async runWithoutEn() {
    await this._setEntityRuFile()
    this._setArrWord()
    this._formatFile()
    await this._translate()
    this._setArrStrToCamelCase()
    this._keyOrganization()
    this._writeRuFile()
  }

  async _setEntityRuFile() {
    const data = await new Promise((resolve, reject) => {
      try {
        fs.readFile(this.state.config.pathToReadRuFile, "utf8", (err, data) => {
          resolve(data)
        })
      } catch (err) {
        console.error(err)
        reject(err)
      }
    })

    this.state.dataStrRu = data
  }

  async _setEntityEnFile() {
    const data = await new Promise((resolve, reject) => {
      try {
        fs.readFile(this.state.config.pathToReadEnFile, "utf8", (err, data) => {
          resolve(data)
        })
      } catch (err) {
        console.error(err)
        reject(err)
      }
    })

    this.state.dataStrEn = data
  }

  _setArrWord() {
    this.state.arrWordRu = this.state.dataStrRu.split("\n")
    this.state.arrWordEn = this.state.dataStrEn.split("\n")

    this.state.arrWordRu = this.state.arrWordRu.filter((el) => el.length)
    this.state.arrWordEn = this.state.arrWordEn.filter((el) => el.length)
  }

  _formatFile() {
    this.state.arrWordRu = this.state.arrWordRu.filter(
      (el) => !el.includes("↓")
    )
  }

  async _translate() {
    const arrReq = []

    this.state.arrWordRu.forEach((el) => {
      const res = getTranslateWord(el, {
        from: this.state.config.translateFrom,
        to: this.state.config.translateTo,
      })
      arrReq.push(res)
    })

    const res = await Promise.all(arrReq)
    const arrWordTranslate = res.map((el) => el.text)
    this.state.arrWordTranslate = arrWordTranslate
  }

  _loggerState() {
    console.log(this.state)
  }

  _setArrStrToCamelCase() {
    const data = []

    this.state.arrWordTranslate.forEach((el) => {
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

    this.state.arrWordCamelCase = data
  }

  _setArrEnStrToCamelCase() {
    const data = []

    this.state.arrWordEn.forEach((el) => {
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

    this.state.arrWordCamelCase = data
  }

  _keyOrganization() {
    this.state.arrWordCamelCase.forEach((el, index) => {
      this.state.dataObjRu[el] = this.state.arrWordRu[index]
      this.state.dataObjEn[el] = this.state.arrWordEn[index]
    })
  }
  _writeRuFile() {
    fs.writeFileSync(
      this.state.config.pathToWriteRuFile,
      JSON.stringify(this.state.dataObjRu)
    )
  }
  _writeEnFile() {
    fs.writeFileSync(
      this.state.config.pathToWriteEnFile,
      JSON.stringify(this.state.dataObjEn)
    )
  }
}

const config = {
  pathToReadRuFile: "./in-testRu.txt",
  pathToReadEnFile: "./in-testEn.txt",
  pathToWriteRuFile: "./output-test-ru.json",
  pathToWriteEnFile: "./output-test-en.json",
  translateFrom: "ru",
  translateTo: "en",
}

const formatKey = new FormatKey(config)
formatKey.runWithEn()
