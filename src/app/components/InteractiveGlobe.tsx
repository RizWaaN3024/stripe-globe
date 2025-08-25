"use client";
import React, { useEffect, useRef } from 'react'
import * as THREE from "three"

const InteractiveGlobe = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        createGlobe();
    }, [])

    const createGlobe = () => {
        const scene = new THREE.Scene();
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

    const createLayer1_InnerSphere = (scene) => {
        const geometry = new THREE.SphereGeometry(200, 32, 32)

        const material = new THREE.MeshBasicMaterial({
            color: 0x111122,
            transparent: true,
            opacity: 0.8,
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

    const createLayer3_ConnectionArcs = (scene) => {
        const arcGroup = new THREE.Group();
        arcGroup.userData.shouldRotate = true

        const arcRadius = 210

        createSampleArc(arcGroup, arcRadius, 0, 0, Math.PI / 3, Math.PI / 4)
        createSampleArc(arcGroup, arcRadius, Math.PI / 2, Math.PI / 2, Math.PI, Math.PI)
        createSampleArc(arcGroup, arcRadius, -Math.PI / 4, Math.PI / 6, Math.PI / 4, -Math.PI / 3)

        scene.add(arcGroup)
    }

    const createSampleArc = (group, radius, phi1, theta1, phi2, theta2) => {
        const start = new THREE.Vector3()
        const end = new THREE.Vector3()

        start.setFromSphericalCoords(radius, phi1, theta1)
        end.setFromSphericalCoords(radius, phi2, theta2)

        // Create a simple curve between points
        const distance = start.distanceTo(end)
        const midPoint = start.clone().add(end).multiplyScalar(0.5)
        midPoint.normalize().multiplyScalar(radius + distance * 0.3) // Elevate the midpoint

        const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end)

        // Create arc geometry
        const arcGeometry = new THREE.TubeGeometry(curve, 32, 0.5, 8)
        const arcMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0.6
        })

        const arc = new THREE.Mesh(arcGeometry, arcMaterial)
        group.add(arc)

    }
    return (
        <div className='w-full h-[100vh] relative'>
            <div ref={mountRef} className='w-full h-full' />
        </div>
    )
}

export default InteractiveGlobe
