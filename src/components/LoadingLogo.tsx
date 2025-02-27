import { motion } from "framer-motion";
const LoadingLogo = () => {
  return (
    <motion.div
    animate={{
        rotate: [0, 10, -10, 0],
        scale: [1, 1.1, 1],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity, 
        ease: "easeInOut",
      }}
    >
      <img src="/logo.svg" alt="Loading Logo" style={{ width: "100px", height: "100px", fill: "none"}} />
    </motion.div>
  );
};

export default LoadingLogo;
