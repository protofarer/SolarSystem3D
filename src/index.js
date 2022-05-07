import GUI from 'lil-gui'
import * as THREE from 'three'
import WebGL from '../ref/WebGL.js'
import AxisGridHelper from './lib/AxisGridHelper.js'
import MinMaxGUIHelper from './lib/MinMaxGUIHelper.js'

if (WebGL.isWebGLAvailable()) {
  // init function or other inits here
  console.info('WebGL is available')
  main()
} else {
  const warning = WebGL.getWebGLErrorMessage()
  document.getElementById('container').appendChild(warning)
}

function main() {
  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({ canvas })
  const gui = new GUI()

  const initCamProps = {
    fov: 75,
    aspect: 2,
    near: 0.1,
    far: 200,
    position: {
      height: 50
    }
  }

  let camera = new THREE.PerspectiveCamera(
    initCamProps.fov, 
    initCamProps.aspect, 
    initCamProps.near, 
    initCamProps.far
  )
  camera.position.set(0, initCamProps.position.height, 0)     // position
  camera.up.set(0, 0, 1)      // orient camera's up to be +Z
  camera.lookAt(0, 0, 0)      // face
  
  setupCameraControllers(camera, gui)
  

  const scene = new THREE.Scene()

  const objects = []

  // Solar System
  const solarSystem = new THREE.Object3D()
  solarSystem.name = 'solarSystem'
  scene.add(solarSystem)
  objects.push(solarSystem)

  // SUN
  const radius = 1
  const widthSegments = 32
  const heightSegments = 32
  const sphereGeometry = new THREE.SphereGeometry(
    radius, widthSegments, heightSegments
  )
  const sunMaterial = new THREE.MeshPhongMaterial({ 
    emissive: 0xFFFF00
  })
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial)
  sunMesh.name = 'sunMesh'
  sunMesh.scale.set(5, 5, 5,) // make sun large
  solarSystem.add(sunMesh)
  objects.push(sunMesh)

  const color = 0xFFFFFF
  const intensity = 3
  const light = new THREE.PointLight(color, intensity)
  scene.add(light)

  // MERCURY
  const mercuryRoot = new THREE.Object3D()
  mercuryRoot.name = 'mercuryRoot'
  scene.add(mercuryRoot)
  objects.push(mercuryRoot)

  const mercuryOrbit = new THREE.Object3D()
  mercuryOrbit.position.x = 10
  mercuryOrbit.name = 'mercuryOrbit'
  mercuryRoot.add(mercuryOrbit)
  objects.push(mercuryOrbit)

  const mercuryMaterial = new THREE.MeshPhongMaterial({
    color: 'red',
    emissive: 'red',
    shininess: 5,
  })
  const mercuryMesh = new THREE.Mesh(sphereGeometry, mercuryMaterial)
  mercuryMesh.name = 'mercuryMesh'
  mercuryMesh.scale.set(0.4, 0.4, 0.4)
  mercuryOrbit.add(mercuryMesh)
  objects.push(mercuryMesh)
  
  // EARTH
  const earthRoot = new THREE.Object3D()
  earthRoot.name = 'earthRoot'
  scene.add(earthRoot)
  objects.push(earthRoot)

  const earthOrbit = new THREE.Object3D()
  earthOrbit.position.x = 30
  earthOrbit.name = 'earthOrbit'
  earthRoot.add(earthOrbit)
  objects.push(earthOrbit)

  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x2233FF, 
    emissive: 0x112244,
    shininess: 5,
  })
  const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial)
  earthMesh.name = 'earthMesh'
  earthOrbit.add(earthMesh)
  objects.push(earthMesh)

  // MOON
  const moonRoot = new THREE.Object3D()
  moonRoot.name = 'moonRoot'
  earthOrbit.add(moonRoot)
  objects.push(moonRoot)

  const moonOrbit = new THREE.Object3D()
  moonOrbit.position.x = 2
  moonOrbit.name = 'moonOrbit'
  moonRoot.add(moonOrbit)

  // MOON
  const moonMaterial = new THREE.MeshPhongMaterial({
    color: 0x888888,
    emissive: 0x222222,
  })
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial)
  moonMesh.scale.set(0.5, 0.5, 0.5)
  moonMesh.name = 'moonMesh'
  moonOrbit.add(moonMesh)
  objects.push(moonMesh)

  setupHelpers(objects, gui)

  const timeProps = { multiplier: 1 }
  gui.add(timeProps, 'multiplier', 0.01, 2, 0.01)
  function render(time) {
    // requestAnimationFrame passes time in ms, convert to sec
    time *= 0.001
    time *= timeProps.multiplier

    // render with a resolution that matches the display size of the canvas.
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    objects.forEach(o => {
      // Set bodies' orbit tangent speed
      switch (o.name) {
        case 'solarSystem':
          // o.rotation.y = 0;
          break
        case 'sunMesh':
          o.rotation.y = time * 0.1
          break
        case 'mercuryRoot':
          o.rotation.y = time * (365 / 88)
          break
        case 'earthRoot':
          o.rotation.y = time;
          break
        case 'moonRoot':
          o.rotation.y = time * (365 / 27.5);    // set to moon sidereal period
          break
        default:
          break
      }
      // o.rotation.y = time

      // // Add an AxesHelper to each node
      // const axes = new THREE.AxesHelper()
      // axes.material.depthTest = false     // don't check whether axes drawn behind something else
      // axes.renderOrder = 1      // draw after all the spheres
      // o.add(axes)
    })

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)

  function resizeRendererToDisplaySize(renderer) {
    // returns true if the canvas was resized. We can use this to check 
    // if there are other things we should update.

    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize
  }
}

function setupCameraControllers(camera, gui) {
  function updateCamera() {
    camera.updateProjectionMatrix()
    console.log(`camera`, camera)
  }
  gui.add(camera, 'fov', 1, 180).onChange(updateCamera)
  // add controller for camera.up
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 10)
  gui.add(minMaxGUIHelper, 'min', 0.1, 50, 1).name('near').onChange(updateCamera)
  gui.add(minMaxGUIHelper, 'max', 30, 100, 1).name('far').onChange(updateCamera)
}
function setupHelpers(objects, gui) {
  const helpers = []

  function makeAxisGrid(node, label, units) {
    const helper = new AxisGridHelper(node, units)
    gui.add(helper, 'visible').name(label)
    return helper;
  }

  objects.forEach(o => {
    switch (o.name) {
      case 'solarSystem':
        helpers.push(makeAxisGrid(o, o.name, 25))
        break
      default:
        helpers.push(makeAxisGrid(o, o.name))
        break
    }
  })

  // toggle all helpers' visibility
  gui.add({ 
    toggleViz() {
      helpers.forEach(h => h.visible = !h.visible)
      gui.controllers.forEach(c => c.updateDisplay())
    }
  }, 'toggleViz').name('toggle all visibility')

}