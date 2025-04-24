import { ConverterStor } from "@/entities";
import { Button, Modal } from "antd/lib";
import { observer } from "mobx-react-lite";
import { laneMark } from "@/types";

import styles from "./CheckingDuplicateNamesBtn.module.css"
// Компонента проверки дублей имён
const CheckingDuplicateNamesBtn = observer(() => {

    const {
        store: { sourceFile, isNameDuplicatesModalOpen, duplicatesNames, checkingDuplicateNames, setDuplicatePointNamesModalState },
    } = ConverterStor;

    const clickHandler = () => {
        checkingDuplicateNames()
    }

    // При завершении просмотра дублей
    const duplicateNamesClickHandler = () => {
        setDuplicatePointNamesModalState(false);
    }
    const duplicateNamesCancelHandler = () => {
        setDuplicatePointNamesModalState(false);
    }

    // Кнопка проверки дублей имён
    return <>
        <Button onClick={clickHandler} className="buttun-upload" disabled={sourceFile ? false : true} type={"primary"}>
            Проверить дубли имён
        </Button>


        {/* 🔻 Модалка дублей имён 🔻 */}
        <Modal
            title="Сдублированные названия точек"
            open={isNameDuplicatesModalOpen}
            onOk={duplicateNamesClickHandler}
            onCancel={duplicateNamesCancelHandler}
        >
            {
                duplicatesNames.length
                    ? duplicatesNames.flatMap((poin: laneMark[], index: number) => {
                        return <div key={index} className={styles.duplicatesNamesWrapper}>
                            {
                                poin.map((obj: laneMark, index: number) => {
                                    return <div className={styles.duplicatesNamesBlock} key={`${obj.mLaneMarkName}-${index}`}>
                                        <div className={styles.duplicatesNamesTitle}>
                                            <span>Название: </span><span>{obj.mLaneMarkName}</span>
                                        </div>
                                        <div className={styles.duplicatesNamesCoords}>
                                            <div><span>x: </span><span>{obj.mLaneMarkXYZW.x}</span></div>
                                            <div><span>y: </span><span>{obj.mLaneMarkXYZW.y}</span></div>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    })
                    : <div>Нет дублей имён!</div>
            }
        </Modal>
    </>
});

export default CheckingDuplicateNamesBtn;