import { ConverterStor } from "@/entities";
import { Button, Tooltip } from "antd/lib";
import { observer } from "mobx-react-lite";

const RedefineAllIdsBtn = observer(() => {
    const {
        store: { outputFile, redefineAllIds },
    } = ConverterStor;

    return <>
        <Tooltip title={"Не работает с точками!"}>
            <Button
                className="buttun-upload"
                disabled={outputFile ? false : true} type={"primary"}
                onClick={redefineAllIds}
            >
                Заменить все дубли ID
            </Button>
        </Tooltip>
    </>
});

export default RedefineAllIdsBtn;