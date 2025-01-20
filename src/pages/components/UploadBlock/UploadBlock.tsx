import { ConverterStor } from "@/entities";
import UploadForm from "../UploadForm/UploadForm";
import { observer } from "mobx-react-lite";

export const UploadBlock = observer(() => {

    const {
        store: { sourceFileName, outputFileName, setSourceFileName, setOutputFileName, setSourceFile, setOutputFile },
    } = ConverterStor;

    return (<>

        <UploadForm
            title={'Исходный файл'}
            fileName={sourceFileName}
            fileUpload={"sourse-file"}
            setFileName={setSourceFileName}
            setFile={setSourceFile}
        />

        <UploadForm
            title={'Изменённый файл'}
            fileName={outputFileName}
            fileUpload={"changed-file"}
            setFileName={setOutputFileName}
            setFile={setOutputFile}
        />

    </>);
});