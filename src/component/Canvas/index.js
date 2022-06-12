import React, { Component } from 'react';
import * as THREE from "three";
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';
// post-processing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

const params = {
  exposure: 1,
  bloomStrength: 1.5,
  bloomThreshold: 0,
  bloomRadius: 0
};

export default class CanvasThreejs extends Component {

    componentDidMount() {
	    // === THREE.JS CODE START ===

      // ### DECLEARE ###
      var scene = new THREE.Scene();
      scene.background = new THREE.Color( 0x000000 );
      scene.fog = new THREE.Fog( 0x000000, 0, 0.1 );

      var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.05, 100 );
      camera.position.set( 0, 0, 0.5 );
      var renderer = new THREE.WebGLRenderer();
      // custom Light
			// var pointLight, pointLight2;

      // ### Apeend canvas & Environment ###
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );
      window.addEventListener( 'resize', onWindowResize );
      // camera.position.z = 5;


      // ### Apeend Texture ###
      // Texture
      const size = 256;
      const data = new Uint8Array( size * size * size );

      let i = 0;
      const perlin = new ImprovedNoise();
      const vector = new THREE.Vector3();

      for ( let z = 0; z < size; z ++ ) {

        for ( let y = 0; y < size; y ++ ) {

          for ( let x = 0; x < size; x ++ ) {

            vector.set( x, y, z ).divideScalar( size );

            const d = perlin.noise( vector.x * 6.5, vector.y * 6.5, vector.z * 6.5 );

            data[ i ++ ] = d * 128 + 128;

          }

        }

      }

      const texture = new THREE.Data3DTexture( data, size, size, size );
      texture.format = THREE.RedFormat;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.unpackAlignment = 1;
      texture.needsUpdate = true;

      // Material

      const vertexShader = /* glsl */`
      in vec3 position;
      uniform mat4 modelMatrix;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform vec3 cameraPos;

      out vec3 vOrigin;
      out vec3 vDirection;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        vOrigin = vec3( inverse( modelMatrix ) * vec4( cameraPos, 1.0 ) ).xyz;
        vDirection = position - vOrigin;

        gl_Position = projectionMatrix * mvPosition;
      }
      `;

      const fragmentShader = /* glsl */`
      precision highp float;
      precision highp sampler3D;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      in vec3 vOrigin;
      in vec3 vDirection;
      out vec4 color;
      uniform sampler3D map;
      uniform float threshold;
      uniform float steps;
      vec2 hitBox( vec3 orig, vec3 dir ) {
        const vec3 box_min = vec3( - 0.5 );
        const vec3 box_max = vec3( 0.5 );
        vec3 inv_dir = 1.0 / dir;
        vec3 tmin_tmp = ( box_min - orig ) * inv_dir;
        vec3 tmax_tmp = ( box_max - orig ) * inv_dir;
        vec3 tmin = min( tmin_tmp, tmax_tmp );
        vec3 tmax = max( tmin_tmp, tmax_tmp );
        float t0 = max( tmin.x, max( tmin.y, tmin.z ) );
        float t1 = min( tmax.x, min( tmax.y, tmax.z ) );
        return vec2( t0, t1 );
      }
      float sample1( vec3 p ) {
        return texture( map, p ).r;
      }
      #define epsilon .0001
      vec3 normal( vec3 coord ) {
        if ( coord.x < epsilon ) return vec3( 1.0, 0.0, 0.0 );
        if ( coord.y < epsilon ) return vec3( 0.0, 1.0, 0.0 );
        if ( coord.z < epsilon ) return vec3( 0.0, 0.0, 1.0 );
        if ( coord.x > 1.0 - epsilon ) return vec3( - 1.0, 0.0, 0.0 );
        if ( coord.y > 1.0 - epsilon ) return vec3( 0.0, - 1.0, 0.0 );
        if ( coord.z > 1.0 - epsilon ) return vec3( 0.0, 0.0, - 1.0 );
        float step = 0.01;
        float x = sample1( coord + vec3( - step, 0.0, 0.0 ) ) - sample1( coord + vec3( step, 0.0, 0.0 ) );
        float y = sample1( coord + vec3( 0.0, - step, 0.0 ) ) - sample1( coord + vec3( 0.0, step, 0.0 ) );
        float z = sample1( coord + vec3( 0.0, 0.0, - step ) ) - sample1( coord + vec3( 0.0, 0.0, step ) );
        return normalize( vec3( x, y, z ) );
      }
      void main(){
        vec3 rayDir = normalize( vDirection );
        vec2 bounds = hitBox( vOrigin, rayDir );
        if ( bounds.x > bounds.y ) discard;
        bounds.x = max( bounds.x, 0.0 );
        vec3 p = vOrigin + bounds.x * rayDir;
        vec3 inc = 1.0 / abs( rayDir );
        float delta = min( inc.x, min( inc.y, inc.z ) );
        delta /= steps;
        for ( float t = bounds.x; t < bounds.y; t += delta ) {
          float d = sample1( p + 0.5 );
          if ( d > threshold ) {
            color.rgb = normal( p + 0.5 ) * 0.5 + ( p * 1.5 + 0.25 );
            color.a = 1.;
            break;
          }
          p += rayDir * delta;
        }
        if ( color.a == 0.0 ) discard;
      }
      `;

      
      // // ### Lights ### 

      const geometry = new THREE.BoxGeometry( 1, 1, 1 );
      const material = new THREE.RawShaderMaterial( {
        glslVersion: THREE.GLSL3,
        uniforms: {
          map: { value: texture },
          cameraPos: { value: new THREE.Vector3() },
          threshold: { value: 0.65 },
          steps: { value: 300 }
        },
        vertexShader,
        fragmentShader,
        side: THREE.BackSide,
      } );

      const mesh = new THREE.Mesh( geometry, material );
      scene.add( mesh );

      // const parameters = { threshold: 0.65, steps: 500 };

      // ### mouse ###
      const mouse = new THREE.Vector3( 0, 0, 1 );
			document.addEventListener( 'mousemove', onDocumentMouseMove );

      // ### composer ###
      const renderScene = new RenderPass( scene, camera );

      // const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
      // bloomPass.threshold = params.bloomThreshold;
      // bloomPass.strength = params.bloomStrength;
      // bloomPass.radius = params.bloomRadius;

      // const bokehPass = new BokehPass( scene, camera, {
      //   focus: 100,
      //   aperture: 3,
      //   maxblur: 0.1,

      //   width: window.innerWidth,
      //   height: window.innerHeight
      // } );

      const composer = new EffectComposer( renderer );
      composer.addPass( renderScene );
      // composer.addPass( bloomPass );
      // composer.addPass( bokehPass );

      // ### Updating ###
      animate();

      // ### FUNCs ###
      // # animation update
      function animate (time) {
        // console.log(time)
        requestAnimationFrame( animate );

        // parameters.threshold = 0.75+Math.sin( time * 0.002 )*0.03;
        
				// material.uniforms.steps.value = parameters.steps;
        mesh.rotation.z += 0.001;
        mesh.rotation.x = Math.sin( mouse.y*0.15 / window.innerHeight );
        mesh.rotation.y = Math.sin( mouse.x*0.15 / window.innerWidth )
        
        material.uniforms.threshold.value = 0.65 + Math.sin( mouse.x*0.15 / window.innerWidth )*0.1 + Math.sin( mouse.y*0.15 / window.innerWidth )*0.05;

        mesh.material.uniforms.cameraPos.value.copy( camera.position );

        renderer.render( scene, camera );
        // render postprocessing
        composer.render();
      };

      //  # resize
      function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );

			}
      //  # mouse
      function onDocumentMouseMove( event ) {

				mouse.x = ( event.clientX - window.innerWidth / 2 ) * 8;
				mouse.y = ( event.clientY - window.innerHeight / 2 ) * 8;

			}
      // === THREE.JS EXAMPLE CODE END ===
    }

    render () {    	
        return (
            <div/>
        );
    }
}