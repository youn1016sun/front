import React, { ReactNode } from "react";
import { Link } from 'react-router-dom';

// const Header: React.FC = () => {
//   return (
//     <header className='custom-header'>
//       <nav>
//         <ul>
//           <li><Link to="/">Home</Link></li>
//           <li><Link to="/login">Login</Link></li>
//           <li><Link to="/review">Review</Link></li>
//         </ul>
//       </nav>
//     </header>
//   );
// };



interface HeaderProps {
  children?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className="custom-header">
      <nav>
        <ul>
          {children} {/* ✅ props로 전달된 컴포넌트 표시 */}
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/review">Review</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;