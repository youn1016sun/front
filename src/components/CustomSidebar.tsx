import { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';

export default function BasicDemo({ children }) {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <div className="sidebar-button">

            <Sidebar visible={visible} onHide={() => setVisible(false)}>
                <h2>Sidebar</h2>
                { children }
                {/* <p>
                    { children }
                </p> */}
            </Sidebar>
            <Button icon="pi pi-arrow-right" onClick={() => setVisible(true)} />
        </div>
    )
}
        