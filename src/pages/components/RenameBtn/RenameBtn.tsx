import { ConverterStor } from "@/entities";
import { Button } from "antd/lib";
import { observer } from "mobx-react-lite";

const RenameBtn = observer(() => {
    const {
        store: { outputFile, renameObj },
    } = ConverterStor;

    return <>
        <Button
            className="buttun-upload"
            disabled={outputFile ? false : true} type={"primary"}
            onClick={renameObj}
        >
            Переименовать
        </Button>
    </>
});

export default RenameBtn;