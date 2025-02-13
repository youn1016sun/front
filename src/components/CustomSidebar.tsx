import { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import History from '../components/History';

interface CustomSidebarProps {
    userId: number | null;
  }
  
  export default function CustomSidebar({ userId }: CustomSidebarProps) {
    const [visible, setVisible] = useState<boolean>(false);
  
    return (
      <div className="sidebar-button">
        <Sidebar visible={visible} onHide={() => setVisible(false)}>
          <h2>히스토리</h2>
          <History userId={userId} /> {/* ✅ History 컴포넌트 추가  - history컴포넌트로 userid를 넘겨줌.*/}
        </Sidebar>
        <Button icon="pi pi-arrow-right" onClick={() => setVisible(true)} />
      </div>
    );
  }
        