import { useEffect } from "react"
import { Modal, Form, Input, InputNumber, DatePicker, Select, Button, message } from "antd"
import { addMovie } from "../../apiCall/moviesApi"
import dayjs from "dayjs"

const { TextArea } = Input
const { Option } = Select

function MoviesForm({ visible, onClose, initialData, onAddSuccess, onUpdateSuccess }) {
    const [form] = Form.useForm()
    const isEditMode = !!initialData

    // Pre-fill form when editing
    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                ...initialData,
                releaseDate: initialData.releaseDate
                    ? dayjs(initialData.releaseDate)
                    : null,
            })
        } else {
            form.resetFields()
        }
    }, [initialData, form])

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()

            const payload = {
                ...values,
                releaseDate: values.releaseDate
                    ? values.releaseDate.toISOString()
                    : null,
            }

            if (isEditMode) {
                // Trigger update in MoviesList
                await onUpdateSuccess(initialData._id, payload) 
            } else {
                // Add new movie
                const response = await addMovie(payload)
                message.success("Movie added successfully")
                onAddSuccess(response.data.data)
            }

            form.resetFields()
        } catch (error) {
            if (error?.errorFields) return // antd validation error, already shown inline
            message.error(
                error.response?.data?.message || "Something went wrong"
            )
        }
    }

    return (
        <Modal
            title={isEditMode ? "Edit Movie" : "Add Movie"}
            open={visible}
            onCancel={() => {
                form.resetFields()
                onClose()
            }}
                maskClosable={false}   // ← add this

            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    {isEditMode ? "Update" : "Add"}
                </Button>,
            ]}
            width={600}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Movie Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter movie name" }]}
                >
                    <Input placeholder="e.g. Interstellar" />
                </Form.Item>

                <Form.Item
                    label="Poster URL"
                    name="poster"
                    rules={[{ required: true, message: "Please enter poster URL" }]}
                >
                    <Input placeholder="https://..." />
                </Form.Item>

                <Form.Item
                    label="Genre"
                    name="genre"
                    rules={[{ required: true, message: "Please enter genre" }]}
                >
                    <Select placeholder="Select genre" mode="multiple">
                        <Option value="Action">Action</Option>
                        <Option value="Drama">Drama</Option>
                        <Option value="Comedy">Comedy</Option>
                        <Option value="Thriller">Thriller</Option>
                        <Option value="Horror">Horror</Option>
                        <Option value="Sci-Fi">Sci-Fi</Option>
                        <Option value="Romance">Romance</Option>
                        <Option value="Animation">Animation</Option>
                        <Option value="Documentary">Documentary</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: "Please enter description" }]}
                >
                    <TextArea rows={3} placeholder="Short description of the movie" />
                </Form.Item>

                <Form.Item
                    label="Duration (minutes)"
                    name="duration"
                    rules={[{ required: true, message: "Please enter duration" }]}
                >
                    <InputNumber
                        min={1}
                        style={{ width: "100%" }}
                        placeholder="e.g. 148"
                    />
                </Form.Item>

                <Form.Item
                    label="Languages"
                    name="languages"
                    rules={[{ required: true, message: "Please select at least one language" }]}
                >
                    <Select placeholder="Select languages" mode="multiple">
                        <Option value="Hindi">Hindi</Option>
                        <Option value="English">English</Option>
                        <Option value="Tamil">Tamil</Option>
                        <Option value="Telugu">Telugu</Option>
                        <Option value="Kannada">Kannada</Option>
                        <Option value="Malayalam">Malayalam</Option>
                        <Option value="Punjabi">Punjabi</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Release Date"
                    name="releaseDate"
                    rules={[{ required: true, message: "Please select release date" }]}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default MoviesForm