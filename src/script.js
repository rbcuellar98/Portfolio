import './style.css'
import * as THREE from 'three'


/**Color debug palets */
//const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

//gui.addColor(parameters, 'materialColor').onChange(() => {material.color.set(parameters.materialColor)})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter // take the nearest light intensity
// material for better performance used across all 3 objects
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
})
/**
 * Objects with material and size
 */
const objectsDistance = 4
// first object with parameter dimension
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1,0.4, 16, 60),
    material
)
// second object with parameter dimension
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1,2,32),
    material
)
// third object with parameter dimension
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)
// Positioning: moving
mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2


// add all 3 objects into the scene
scene.add(mesh1,mesh2,mesh3)
// add objects into the scenes
const sectionMeshes = [mesh1, mesh2, mesh3]
/**
 * Add Directional Lights to the scene 
 * Help see the material 
 */
const directionalLight = new THREE.DirectionalLight('#ffffff',1)
// move the position of the light representative to the camera above right
directionalLight.position.set(1,1,0)
scene.add(directionalLight)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true // see through the canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // animate the objects
    for(const mesh of sectionMeshes){
        mesh.rotation.x = elapsedTime * 0.1
        mesh.rotation.x = elapsedTime * 0.12
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()