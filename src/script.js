import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'



/**Color debug palets */
// const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

// gui
//     .addColor(parameters, 'materialColor')
//     .onChange(() =>
//     {
//         material.color.set(parameters.materialColor)
//         particlesMaterial.color.set(parameters.materialColor)
//     })



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
const gradientTexture = textureLoader.load('textures/gradients/5.jpg')
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
    new THREE.BoxGeometry(1,1, 1),
    material
)
// second object with parameter dimension
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(0.7,1.5,32),
    material
)
// third object with parameter dimension
const mesh3 = new THREE.Mesh(
    new THREE.SphereGeometry( 0.9, 15, 12 ),
    material
)
/**
 * Position objects in the page according to the side wanted
 */
 mesh1.position.x = 2
 mesh2.position.x = - 2
 mesh3.position.x = 2
 

// Positioning: moving
mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2



// add all 3 objects into the scene
scene.add(mesh1,mesh2,mesh3)
// add objects into the scenes
const sectionMeshes = [mesh1, mesh2, mesh3]

/**
 * Particles
 */
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3) // 3 values per particles due to axis x,y,z
// loop to make particles
for(let i =0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() -0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length // multiplied by the section number
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}
// shape of the particles
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions,3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})
// Points
const particles = new THREE.Points(particlesGeometry,particlesMaterial)
scene.add(particles)

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
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

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
 * Scroll webpage ability
 */
let scrollY = window.scrollY
let currentSection = 0
window.addEventListener('scroll', () =>{
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)
    if(newSection != currentSection)
    {
        currentSection = newSection
        // object rotation
        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z: '+=1.5'
            }
        )
    }
})

/**
 * Cursor position
 */
const cursor = []
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event)=>{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY /sizes.height - 0.5
    
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()