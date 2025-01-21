import { ConverterStor } from "@/entities";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Modal, Popconfirm } from "antd/lib";
import { Button } from "antd/lib";
import { observer } from "mobx-react-lite";

const CompareMapBtn = observer(() => {
    const {
        store: {
            sourceFile, outputFile, isCompareFiles, compareFilesModalState, compareFiles, compareRoadsAndPoints,
            setCompareFilesModalState
        },
    } = ConverterStor;

    const cancelHandler = () => {
        setCompareFilesModalState(false);
    }

    const setStateConfirm = () => {
        compareRoadsAndPoints();
    }

    const setStateCancel = () => {
        compareFiles();
    }

    return <>
        <Popconfirm
            title={"Сравнение карт!"}
            description={"Сравнить только дороги и точки?"}
            onConfirm={setStateConfirm}
            onCancel={setStateCancel}
            okText="Да"
            cancelText="Нет"
            okType="default"
        >
            <Button
                className="buttun-upload"
                disabled={sourceFile && outputFile ? false : true} type={"primary"}
            >
                Сравнить файлы
            </Button>
        </Popconfirm>

        <Modal
            title={"Результат проверки карты на идентичность"}
            open={compareFilesModalState}
            onOk={cancelHandler}
            onCancel={cancelHandler}
            cancelButtonProps={
                { style: { display: 'none' } }
            }
        >
            {isCompareFiles
                ? <div style={{ display: "flex", gap: "16px" }}>
                    <p>
                        Карты абсолютно идентичны!
                    </p>
                    <CheckCircleOutlined style={{ fontSize: "36px", color: "#00EE00" }} />
                </div>
                : <div style={{ display: "flex", gap: "16px" }}>
                    <p>
                        Карты имеют отличия!
                    </p>
                    <CloseCircleOutlined style={{ fontSize: "36px", color: "#FF4040" }} />
                </div>
            }
        </Modal>
    </>
});

export default CompareMapBtn;