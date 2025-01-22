import { ConverterStor } from "@/entities";
import { Spin } from "antd/lib";
import { observer } from "mobx-react-lite";

const LoadingBlock = observer(() => {
    const {
        store: { isLoading },
    } = ConverterStor;

    return (
        isLoading && <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <p className={"converting"}>Обработка...</p>
            <Spin />
        </div>
    );
});

export default LoadingBlock;
