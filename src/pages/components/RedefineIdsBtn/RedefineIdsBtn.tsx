import { ConverterStor } from "@/entities";
import { Button } from "antd/lib";
import { observer } from "mobx-react-lite";

const RedefineIdsBtn = observer(() => {
    const {
        store: { sourceFile, outputFile, redefineIds },
    } = ConverterStor;

    return <>
        <Button
            className="buttun-upload"
            disabled={outputFile && sourceFile ? false : true} type={"primary"}
            onClick={redefineIds}
        >
            Заменить новые дубли ID
        </Button>
    </>
});

export default RedefineIdsBtn;