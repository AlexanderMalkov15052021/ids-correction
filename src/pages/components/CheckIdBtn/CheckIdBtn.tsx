import { ConverterStor } from "@/entities";
import { Button } from "antd/lib";
import { observer } from "mobx-react-lite";

const CheckIdBtn = observer(() => {
    const {
        store: { outputFile, checkIds },
    } = ConverterStor;

    return <>
        <Button
            className="buttun-upload"
            disabled={outputFile ? false : true} type={"primary"}
            onClick={checkIds}
        >
            Проверить дубли ID
        </Button>
    </>
});

export default CheckIdBtn;