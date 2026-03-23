import * as THREE from 'three';



export function initScene( canvas: HTMLCanvasElement){
const renderer = new THREE.WebGLRenderer({canvas, alpha : true})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const geometry = new THREE.PlaneGeometry(2,2)
const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      // added mouse position to the shader to start to move the hologram effect : center of the screen.
    //   uMouse : { value : new THREE.Vector2(0.5, 0.5)},
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

float noise(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float smoothNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = noise(i);
  float b = noise(i + vec2(1.0, 0.0));
  float c = noise(i + vec2(0.0, 1.0));
  float d = noise(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
  vec2 uv = vUv;
  
  float n = smoothNoise(uv * 4.0 + uTime * 0.2);
  
  float r = sin(uv.x * 3.0 + uTime * 0.8 + n * 2.0) * 0.5 + 0.5;
  float g = sin(uv.y * 3.0 + uTime * 0.6 + n * 2.0 + 2.0) * 0.5 + 0.5;
  float b = sin((uv.x + uv.y) * 3.0 + uTime * 0.4 + n * 2.0 + 4.0) * 0.5 + 0.5;
  
// background a litle more transparent to get closer to an hologram effect
//   vec3 color = vec3(r, g, b);
//   gl_FragColor = vec4(color, 1.0);

vec3 color = vec3(r, g, b) * 0.6;  // reduce the intensity
gl_FragColor = vec4(color, 0.7); 
}

    `,
  })

const mesh = new THREE.Mesh(geometry, material )
scene.add(mesh)

let rafId : number

const animate = () => {
    rafId =requestAnimationFrame(animate)
    material.uniforms.uTime.value += 0.03
    renderer.render(scene, camera)
}
animate()



const observer = new ResizeObserver(()=>{
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
observer.observe(canvas)

// const onMouseMove = (e: MouseEvent) => {
//     material.uniforms.uMouse.value.x = e.clientX / window.innerWidth;
//     material.uniforms.uMouse.value.y = e.clientY / window.innerHeight;
// }
// window.addEventListener('mousemove', onMouseMove)

return () => {
    cancelAnimationFrame(rafId);
    observer.disconnect()
    // window.removeEventListener('mousemove', onMouseMove);
    renderer.dispose();
};
};
