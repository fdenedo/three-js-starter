export default {
    root: './',
    publicDir: './public',
    base: './',
    optimizeDeps: {
        include: [
          'three',
          'three/addons/controls/OrbitControls.js',
          'three/examples/jsm/libs/stats.module.js'
        ],
      }
}