import { ConverterStor } from "@/entities";
import { Button, Tooltip } from "antd/lib";
import { observer } from "mobx-react-lite";

const RemoveDuplicateIdsBtn = observer(() => {
    const {
        store: { outputFile, removeDuplicateIds },
    } = ConverterStor;

    return <>
        <Tooltip title={"Заменяет первое вхождение дубля!"}>
            <Button
                className="buttun-upload"
                disabled={outputFile ? false : true} type={"primary"}
                onClick={removeDuplicateIds}
            >
                Удалить дубли ID
            </Button>
        </Tooltip>
    </>
});

export default RemoveDuplicateIdsBtn;