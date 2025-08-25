"use client";
import React, { useEffect, useRef } from 'react'
import * as THREE from "three"

const InteractiveGlobe = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        createGlobe();
    }, [])

    const createGlobe = () => {
        const scene =  new THREE.Scene();
        scene.background = new THREE.Color("#f5f5f5");

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 500;

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(window.innerWidth, window.innerHeight)

        mountRef.current.appendChild(renderer.domElement)

        createLayer1_InnerSphere(scene);
        createLayer2_SurfaceDots(scene);
        // createLayer3_ConnectionArcs(scene);

        const animate = () => {
            requestAnimationFrame(animate)

            scene.children.forEach(child => {
                if (child.userData.shouldRotate) {
                    child.rotation.y += 0.05;
                }
            })

            renderer.render(scene, camera);
        }

        animate();
    }

    const createLayer1_InnerSphere = (scene) => {
        const geometry = new THREE.SphereGeometry(200, 32, 32)
        
        const material = new THREE.MeshBasicMaterial({
            color: 0x111122,
            transparent: true,
            opacity: 0.1,
            // wireframe: true
        })

        const baseSphere = new THREE.Mesh(geometry, material);
        baseSphere.userData.shouldRotate = true;

        scene.add(baseSphere);
    }

    const createLayer2_SurfaceDots = (scene) => {
        const dotsGroup = new THREE.Group();
        dotsGroup.userData.shouldRotate = true

        const dotsCount = 2000
        const radius = 205

        for (let i = 0; i < dotsCount; i++) {
            const dotGeometry = new THREE.CircleGeometry(1.5, 6)
            const dotMaterial = new THREE.MeshBasicMaterial({
                color: 0x4a9eff,
                transparent: true,
                opacity: 0.8
            })

            const dot = new THREE.Mesh(dotGeometry, dotMaterial);

            const phi = Math.acos(-1 + (2 * i) / dotsCount)
            const theta = Math.sqrt(dotsCount * Math.PI) * phi


            const vector = new THREE.Vector3()
            vector.setFromSphericalCoords(radius, phi, theta)

            dot.position.copy(vector)

            dot.lookAt(vector.clone().multiplyScalar(2))

            dotsGroup.add(dot)
        }

        scene.add(dotsGroup)
    }
  return (
    <div className='w-full h-[100vh] relative'>
        <div ref={mountRef} className='w-full h-full' />
    </div>
  )
}

export default InteractiveGlobe
