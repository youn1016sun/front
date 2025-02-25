import { motion } from "framer-motion";
const LoadingLogo = () => {
  return (
    <motion.div
    animate={{
        rotate: [0, 10, -10, 0], // 좌우로 흔들리는 효과
        scale: [1, 1.1, 1], // 약간 커졌다가 작아지는 효과
        opacity: [1, 0.8, 1], // 투명도 변화를 줘서 부드럽게 보이게
      }}
      transition={{
        duration: 1.5, // 애니메이션 지속 시간
        repeat: Infinity, // 무한 반복
        ease: "easeInOut",
      }}
    >
      <img src="/logo.svg" alt="Loading Logo" style={{ width: "100px", height: "100px", fill: "none"}} />
    </motion.div>
  );
};

export default LoadingLogo;
