import * as THREE from 'three'

export default class AxisGridHelper {
  // Turns both axes and grid visible on/off
  // lil-gui requires a property that returns a bool
  // to decide to make a checkbox so we make a setter
  // and getter for `visible` which we can tell lil-gui
  // to look at.

  constructor(node, units = 10) {
    const axes = new THREE.AxesHelper()
    axes.material.depthTest = false
    axes.renderOrder = 2
    node.add(axes)

    const grid = new THREE.GridHelper(units, units)
    grid.material.depthTest = false
    grid.renderOrder = 1
    node.add(grid)

    this.grid = grid
    this.axes = axes
    this.visible = false
  }

  get visible() {
    return this._visible
  }

  set visible(v) {
    this._visible = v
    this.grid.visible = v
    this.axes.visible = v
  }
}