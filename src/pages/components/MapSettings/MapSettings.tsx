import { ConverterStor } from "@/entities";
import { observer } from "mobx-react-lite";
import styles from "./MapSettings.module.css";
import { Button, Form, FormProps, Input } from 'antd/lib';
import Title from "antd/lib/typography/Title";
import { FieldType } from "@/types";
import { FormEvent } from "react";

const MapSettings = observer(() => {
    const {
        store: { outputFile, setTargetId, setReplaceableId, setParams },
    } = ConverterStor;

    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        setParams(values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const changeTargetIdHandler = (evt: FormEvent<HTMLInputElement>) => {
        setTargetId(evt.currentTarget.value);
    }

    const changeReplaceableIdHandler = (evt: FormEvent<HTMLInputElement>) => {
        setReplaceableId(evt.currentTarget.value);
    }

    return <>
        <Form
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{
                targetID: "0",
                replaceableID: "0",
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className={styles["form"]}
        >
            <div className={styles["form-block"]}>

                <div
                    style={
                        outputFile
                            ? { boxShadow: "1px 1px 3px #FF8282, -1px -1px 3px #FF8282" }
                            : { boxShadow: "1px 1px 3px #777, -1px -1px 3px #777", opacity: .5, pointerEvents: "none" }
                    }
                    className={styles["form-item"]}
                >
                    <Title className={styles["item-title"]} level={4}>Установить ID</Title>
                    <div className={styles["item-content"]}>

                        <div className={styles["form-item-block"]}>

                            <Title className={styles.subTitle} level={5}>{"Целевой:"}</Title>

                            <Form.Item<FieldType>
                                label={"ID"}
                                name="targetID"
                                rules={[{ required: true, message: 'Пожалуйста, введите целевой ID!' }]}
                                className={styles["input-wrapper"]}
                            >
                                <Input onChange={changeTargetIdHandler} type="number" autoComplete="on" />
                            </Form.Item>

                        </div>

                        <div className={styles["form-item-block"]}>

                            <Title className={styles.subTitle} level={5}>{"Заменяемый:"}</Title>

                            <Form.Item<FieldType>
                                label={"ID"}
                                name="replaceableID"
                                rules={[{ required: true, message: 'Пожалуйста, введите заменяемый ID!' }]}
                                className={styles["input-wrapper"]}
                            >
                                <Input onChange={changeReplaceableIdHandler} type="number" autoComplete="on" />
                            </Form.Item>

                        </div>

                    </div>
                </div>

            </div>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }} className={styles["submit-btn"]}>
                <Button disabled={!outputFile ? true : false} type="primary" htmlType="submit">
                    Применить
                </Button>
            </Form.Item>

        </Form>
    </>
});

export default MapSettings;