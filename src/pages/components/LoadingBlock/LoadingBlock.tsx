import { ConverterStor } from "@/entities";
import { Spin } from "antd/lib";
import { observer } from "mobx-react-lite";

const LoadingBlock = observer(() => {
    const {
        store: { isLoading },
    } = ConverterStor;

    return (
        isLoading && <>
            <p className={"converting"}>Обработка...</p>
            {/* <div className={"counter"}>
                <span style={{ color: "rgba(0, 0, 0, 0.88)" }}>{loadingTime && loadingTime[0]}</span>
                <span> - мин. : </span>
                <span style={{ color: "rgba(0, 0, 0, 0.88)" }}>{loadingTime && loadingTime[1]}</span>
                <span> - сек.</span>
            </div> */}
            <Spin />
        </>
    );
});

export default LoadingBlock;
