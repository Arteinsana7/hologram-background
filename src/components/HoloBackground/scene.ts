import * as THREE from 'three';



export function initScene( canvas: HTMLCanvasElement){
const renderer = new THREE.WebGLRenderer({canvas, alpha : true})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const geometry = new THREE.PlaneGeometry(2,2)
const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        vec3 colorA = vec3(0.5, 0.0, 1.0);
        vec3 colorB = vec3(0.0, 1.0, 0.8);
        vec3 color = mix(colorA, colorB, vUv.x + sin(uTime) * 0.5);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  })

const mesh = new THREE.Mesh(geometry, material )
scene.add(mesh)

const animate = () => {
    requestAnimationFrame(animate)
    material.uniforms.uTime.value += 0.01
    renderer.render(scene, camera)
}
animate()

const onResize = ()=> {
    renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', onResize)

return () => {
    cancelAnimationFrame(0)
    window.removeEventListener('resize', onResize)
    renderer.dispose()
}
}

