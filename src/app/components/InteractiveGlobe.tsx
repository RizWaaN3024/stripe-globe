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
        scene.background = new THREE.Color(0x000011);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 500;

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(window.innerWidth, window.innerHeight)

        mountRef.current.appendChild(renderer.domElement)

        createLayer1_InnerSphere(scene);
        createLayer2_SurfaceDots(scene);
        createLayer3_ConnectionArcs(scene);

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
  return (
    <div>
      
    </div>
  )
}

export default InteractiveGlobe
