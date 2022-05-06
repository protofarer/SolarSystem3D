export default class MinMaxGUIHelper {
  constructor(obj, minProp, maxProp, minDif) {
    this.obj = obj
    this.minProp = minProp
    this.maxProp = maxProp
    this.minDif = minDif
  }

  get min() {
    return this.obj[this.minProp]
  }

  set min(val) {
    this.obj[this.minProp] = val
    this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], val + this.minDif)
  }

  get max() {
    return this.obj[this.maxProp]
  }

  set max(val) {
    this.obj[this.maxProp] = val
    this.min = this.min     // call min setter
  }
}