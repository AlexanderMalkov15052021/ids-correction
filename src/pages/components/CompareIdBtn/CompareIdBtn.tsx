import { ConverterStor } from "@/entities";
import { Button } from "antd/lib";
import { observer } from "mobx-react-lite";

const CompareIdBtn = observer(() => {
    const {
        store: { sourceFile, outputFile, compareIds },
    } = ConverterStor;

    return <>
        <Button
            className="buttun-upload"
            disabled={sourceFile && outputFile ? false : true} type={"primary"}
            onClick={compareIds}
        >
            Сравнить ID
        </Button>
    </>
});

export default CompareIdBtn;