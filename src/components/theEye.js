import React, { useRef, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import eye from "./../img/logoEye.png";
import eye2 from "./../img/eye.png";
import eye3 from "./../img/eyeEditied.png";
import eye4 from "./../img/softeeer.png";
import eye5 from "./../img/eyenew.png";

import eyeball from "./../img/eyeball3.png";
import pupil from "./../img/pupil2.png";

import glass from "./../img/glassOverlay.png";

export default function TheEye() {
  const perspectiveAngle = 70; // Maximum tilt angle for the eye
  const movementConstraint = 14; // Larger values will limit the eye movement more
  const x = useSpring(0, { stiffness: 100, damping: 20 });
  const y = useSpring(0, { stiffness: 100, damping: 20 });
  const x_eyeball = useTransform(x, (value) => value / 6);
  const y_eyeball = useTransform(y, (value) => value / 6);
  const constrainRef = useRef(null);
  const constrainRect = useRef(null); // Will hold the dimensions of the div containing the eye

  // These transform the x and y spring values to rotation values for the eye
  const rotateX = useTransform(
    y,
    [-(constrainRect.current?.height / 2), constrainRect.current?.height / 2],
    [perspectiveAngle, -perspectiveAngle]
  );
  const rotateY = useTransform(
    x,
    [-(constrainRect.current?.width / 2), constrainRect.current?.width / 2],
    [-perspectiveAngle, perspectiveAngle]
  );

  const rotateX_eyeball = useTransform(
    y_eyeball,
    [-(constrainRect.current?.height / 2), constrainRect.current?.height / 2],
    [perspectiveAngle, -perspectiveAngle]
  );
  const rotateY_eyeball = useTransform(
    x_eyeball,
    [-(constrainRect.current?.width / 2), constrainRect.current?.width / 2],
    [-perspectiveAngle, perspectiveAngle]
  );

  useEffect(() => {
    constrainRect.current = constrainRef.current.getBoundingClientRect(); // Get the dimensions of the div containing the eye

    const updateMotionValues = (e) => {
      // Calculate the center of the div containing the eye
      const centerX =
        constrainRect.current.left + constrainRect.current.width / 2;
      const centerY =
        constrainRect.current.top + constrainRect.current.height / 2;

      // Calculate the maximum distance the eye can move
      const radius = constrainRect.current.width / movementConstraint;

      // Calculate the difference between the mouse position and the center of the eye
      let diffX = e.clientX - centerX;
      let diffY = e.clientY - centerY;

      // Calculate the distance and angle from the mouse position to the center of the eye
      const distance = Math.sqrt(diffX ** 2 + diffY ** 2);
      const angle = Math.atan2(diffY, diffX);

      // If the mouse is within the maximum movement distance of the eye, move the eye towards the mouse
      if (distance < radius) {
        x.set(0);
        y.set(0);
      } else {
        // If the mouse is outside the maximum movement distance, move the eye to the edge of the movement area
        x.set((1 - radius / distance) * radius * Math.cos(angle));
        y.set((1 - radius / distance) * radius * Math.sin(angle));
      }
    };

    window.addEventListener("mousemove", updateMotionValues);

    return () => {
      window.removeEventListener("mousemove", updateMotionValues);
    };
  }, [x, y]);

  return (
    <motion.div className="theEye" ref={constrainRef}>
      <motion.div className="iris">
        <motion.div
          style={{
            translateX: x,
            translateY: y,
            rotateX,
            rotateY,
            perspective: 2000,
            transformStyle: "preserve-3d",
          }}
        >
          <img src={pupil} className="pupil" />
        </motion.div>

        <motion.img
          src={eyeball}
          style={{
            translateX: x_eyeball,
            translateY: y_eyeball,
            // rotateX_eyeball,
            // rotateY_eyeball,
            // perspective: 2000,
            // transformStyle: "preserve-3d",
          }}
          className="eyeball"
        />
      </motion.div>
      <img src={glass} className="glassOverlay" />
    </motion.div>
  );
}
