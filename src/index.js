import GUI from 'lil-gui'
import * as THREE from 'three'
import WebGL from '../ref/WebGL.js'
import AxisGridHelper from './lib/AxisGridHelper.js'

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

  const fov = 75
  const aspect = 2
  const near = 0.1
  const far = 200
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 50, 0)     // position
  camera.up.set(0, 0, 1)      // orient camera's up to be +Z
  camera.lookAt(0, 0, 0)      // face

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

  // MERCURY ORBIT
  const mercuryOrbit = new THREE.Object3D()
  mercuryOrbit.position.x = 10
  mercuryOrbit.name = 'mercuryOrbit'
  solarSystem.add(mercuryOrbit)
  objects.push(mercuryOrbit)

  // MERCURY
  const mercuryMaterial = new THREE.MeshPhongMaterial({
    color: 'red',
    emissive: 'red'
  })
  const mercuryMesh = new THREE.Mesh(sphereGeometry, mercuryMaterial)
  mercuryMesh.name = 'mercuryMesh'
  mercuryMesh.scale.set(0.4, 0.4, 0.4)
  mercuryOrbit.add(mercuryMesh)
  objects.push(mercuryMesh)
  
  // EARTH ORBIT
  const earthOrbit = new THREE.Object3D()
  earthOrbit.position.x = 30
  earthOrbit.name = 'earthOrbit'
  solarSystem.add(earthOrbit)
  objects.push(earthOrbit)

  // EARTH
  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x2233FF, 
    emissive: 0x112244 
  })
  const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial)
  earthMesh.name = 'earthMesh'
  earthOrbit.add(earthMesh)
  objects.push(earthMesh)

  // MOON ORBIT
  const moonOrbit = new THREE.Object3D()
  moonOrbit.position.x = 2
  moonOrbit.name = 'moonOrbit'
  earthOrbit.add(moonOrbit)

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

  function makeAxisGrid(node, label, units) {
    const helper = new AxisGridHelper(node, units)
    gui.add(helper, 'visible').name(label)
  }

  objects.forEach(o => {
    if (o.name === 'solarSystem') {
      makeAxisGrid(o, o.name, 25)
    } else {
      makeAxisGrid(o, o.name)
    }
  })

  function render(time) {
    // requestAnimationFrame passes time in ms, convert to sec
    time *= 0.001

    // render with a resolution that matches the display size of the canvas.
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    objects.forEach(o => {
      switch (o.name) {
        case 'sunRoot':
          o.rotation.y = time * 0.1
          break
        default:
          break
      }
      o.rotation.y = time

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