import React, { Component } from 'react';
import * as THREE from "three";

export default class CanvasThreejs extends Component {

    componentDidMount() {
	    // === THREE.JS CODE START ===

      // ### DECLEARE ###
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
      var renderer = new THREE.WebGLRenderer();
      // custom Light
			var pointLight, pointLight2;

      // ### Apeend canvas & Environment ###
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );
      window.addEventListener( 'resize', onWindowResize );
      camera.position.z = 5;

      // ### Lights ### 
      function createLight( color ) {

        const intensity = 1.5;

        const light = new THREE.PointLight( color, intensity, 20 );
        light.castShadow = true;
        light.shadow.bias = - 0.005; // reduces self-shadowing on double-sided objects

        let geometry = new THREE.SphereGeometry( 0.3, 12, 6 );
        let material = new THREE.MeshBasicMaterial( { color: color } );
        material.color.multiplyScalar( intensity );
        let sphere = new THREE.Mesh( geometry, material );
        light.add( sphere );

        const texture = new THREE.CanvasTexture( generateTexture() );
        texture.magFilter = THREE.NearestFilter;
        texture.wrapT = THREE.RepeatWrapping;
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.set( 1, 4.5 );

        geometry = new THREE.SphereGeometry( 2, 32, 8 );
        material = new THREE.MeshPhongMaterial( {
          side: THREE.DoubleSide,
          alphaMap: texture,
          alphaTest: 0.5
        } );

        sphere = new THREE.Mesh( geometry, material );
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        light.add( sphere );

        // custom distance material
        const distanceMaterial = new THREE.MeshDistanceMaterial( {
          alphaMap: material.alphaMap,
          alphaTest: material.alphaTest
        } );
        sphere.customDistanceMaterial = distanceMaterial;

        return light;
      }

      pointLight = createLight( 0x0088ff );
      scene.add( pointLight );

      pointLight2 = createLight( 0xff8888 );
      scene.add( pointLight2 );

			function generateTexture() {

				const canvas = document.createElement( 'canvas' );
				canvas.width = 2;
				canvas.height = 2;

				const context = canvas.getContext( '2d' );
				context.fillStyle = 'white';
				context.fillRect( 0, 1, 2, 1 );

				return canvas;
			}


      // ### Subjects ###
      const geometry = new THREE.BoxGeometry( 30, 30, 30 );

      const material = new THREE.MeshPhongMaterial( {
        color: 0xa0adaf,
        shininess: 10,
        specular: 0x111111,
        side: THREE.BackSide
      } );

      const mesh = new THREE.Mesh( geometry, material );
      mesh.position.y = 10;
      mesh.receiveShadow = true;
      scene.add( mesh );

      // ### Updating ###
      animate();

      // ### FUNCs ###
      // # animation
      function animate (time) {
        // console.log(time)
        requestAnimationFrame( animate );

        pointLight.position.x = Math.sin( time * 0.002 ) * 3 + Math.cos( time * 0.002 ) * 3;
				pointLight.position.y = Math.cos( time * 0.003 ) * .6 - 2;
				pointLight.position.z = Math.sin( time * 0.004 ) * 3;

				pointLight.rotation.x += 0.02;
				pointLight.rotation.z += 0.01;

				pointLight2.position.x = Math.sin( time * 0.004 ) * 3 - 1;
				pointLight2.position.y = Math.sin( time * 0.003 ) * .6 + 2;
				pointLight2.position.z = Math.cos( time * 0.002 ) * 3 + Math.sin( time * 0.002 ) * 3;

				pointLight2.rotation.y -= 0.01;
				pointLight2.rotation.z += 0.02;

        renderer.render( scene, camera );
      };
      //  # resize
      function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );

			}

      // === THREE.JS EXAMPLE CODE END ===
    }

    render () {    	
        return (
            <div/>
        );
    }
}