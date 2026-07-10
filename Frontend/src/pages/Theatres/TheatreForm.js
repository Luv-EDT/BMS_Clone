import { useEffect } from "react"
import { Modal, Form, Input, Button, message } from "antd"
import { addTheatre } from "../../apiCall/theatreApi"

function TheatreForm({ visible, onClose, initialData, onAddSuccess, onUpdateSuccess }) {
    const [form] = Form.useForm()
    const isEditMode = !!initialData

    // Pre-fill form when editing
    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                name: initialData.name,
                address: initialData.address,
                phone: initialData.phone,
                email: initialData.email,
            })
        } else {
            form.resetFields()
        }
    }, [initialData, form])

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()

            if (isEditMode) {
                await onUpdateSuccess(initialData._id, values)
            } else {
                const response = await addTheatre(values)
                message.success("Theatre added successfully")
                onAddSuccess(response.data.data)
            }

            form.resetFields()
        } catch (error) {
            if (error?.errorFields) return
            message.error(
                error.response?.data?.message || "Something went wrong"
            )
        }
    }

    return (
        <Modal
            title={isEditMode ? "Edit Theatre" : "Add Theatre"}
            open={visible}
            onCancel={() => {
                form.resetFields()
                onClose()
            }}
            maskClosable={false}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    {isEditMode ? "Update" : "Add"}
                </Button>,
            ]}
            width={520}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Theatre Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter theatre name" }]}
                >
                    <Input placeholder="e.g. PVR Cinemas" />
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: "Please enter address" }]}
                >
                    <Input.TextArea rows={2} placeholder="Full address" />
                </Form.Item>

                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                        { required: true, message: "Please enter phone number" },
                        { pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit phone number" }
                    ]}
                >
                    <Input placeholder="e.g. 9876543210" maxLength={10} />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please enter email" },
                        { type: "email", message: "Enter a valid email" }
                    ]}
                >
                    <Input placeholder="e.g. theatre@example.com" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default TheatreForm