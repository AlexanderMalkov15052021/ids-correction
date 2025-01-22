import { ConverterStor } from "@/entities";
import { observer } from "mobx-react-lite";
import { Modal } from "antd/lib";

let count = 0;

const ModalIds = observer(() => {
    const {
        store: { modalIdsState, duplicateObjectsGroup, duplicateObjects, refreshCheckIds, setModalIdsState },
    } = ConverterStor;

    const cancelHandler = () => {

        refreshCheckIds();

        setModalIdsState(false);
    }

    return <>
        <Modal
            title="Результат проверки карты на наличее дубликатов ID"
            open={modalIdsState}
            onOk={cancelHandler}
            onCancel={cancelHandler}
            cancelButtonProps={
                { style: { display: 'none' } }
            }
        >
            <div>
                {
                    Object.keys(duplicateObjectsGroup).map((key) => {
                        return (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center"
                                }}
                                key={count + duplicateObjects.length + 1}
                            >
                                {
                                    ...duplicateObjectsGroup[Number(key)].map(obj => {
                                        return (
                                            <div
                                                key={++count}
                                                style={{
                                                    display: "inline-block",
                                                    padding: "10px",
                                                    marginTop: "16px",
                                                    marginLeft: "16px",
                                                    borderRadius: "8px",
                                                    boxShadow: "1px 1px 3px #FFd040, -1px -1px 3px #FFd040"
                                                }}
                                            >
                                                <div>{count + 1}</div>
                                                <div>
                                                    <span style={{ fontWeight: "bold" }}>Имя: </span>
                                                    <span>{obj.name ? obj.name : "-"}</span>
                                                </div>
                                                <div>
                                                    <span style={{ fontWeight: "bold" }}>ID: </span>
                                                    <span>{obj.id}</span>
                                                </div>
                                                <div>
                                                    <span style={{ fontWeight: "bold" }}>Координаты: </span>
                                                    <div>
                                                        <div>
                                                            <span style={{ fontWeight: "bold" }}>x: </span>
                                                            <span>{obj.coords?.x} </span>
                                                        </div>
                                                        <div>
                                                            <span style={{ fontWeight: "bold" }}>y: </span>
                                                            <span>{obj.coords?.y} </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })

                }
            </div>
        </Modal>
    </>
});

export default ModalIds;