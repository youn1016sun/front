import React from "react";
import { Accordion, AccordionTab } from 'primereact/accordion';
import History from "./History.tsx";
import { Divider } from "primereact/divider";

interface HistoryData {
    id: number;
    problem_id: number;
    name: string;
    created_at: Date;
}

interface Props {
    data: [number, HistoryData[]][];  // 배열 형태로 변경
}

function HistoryTab({ data }: Props) {
    console.log(data);
    return (
        <Accordion activeIndex={0}>
            {data.map(([problem_id, historyList]) => (  // 배열 구조 분해 할당
                <AccordionTab key={problem_id} header={problem_id}>
                    {historyList.map((historyRow, index) => (
                        <History key={index} name={historyRow.name} />
                    ))}
                </AccordionTab>
            ))}
        </Accordion>
    );
}


export default HistoryTab;
