import { useEffect, useState } from "react"
import { Modal, Form, Input, InputNumber, DatePicker, Select, Button, message } from "antd"
import { addShow, updateShow } from "../../apiCall/showsApi"
import { getAllMovies } from "../../apiCall/moviesApi"
import { getAllTheatres } from "../../apiCall/theatreApi"
import dayjs from "dayjs"

function ShowsForm({ visible, onClose, initialData, preselectedTheatre, onAddSuccess, onUpdateSuccess }) {
    const [form] = Form.useForm()
    const [movies, setMovies] = useState([])
    const [theatres, setTheatres] = useState([])
    const isEditMode = !!initialData

    // fetch movies and approved theatres for dropdowns
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [moviesRes, theatresRes] = await Promise.all([
                    getAllMovies(),
                    getAllTheatres(),
                ])
                setMovies(moviesRes.data.data)
                // only approved theatres can have shows
                setTheatres(
                    theatresRes.data.data.filter((t) => t.isActive === true)
                )
            } catch (error) {
                message.error("Failed to load dropdown data")
            }
        }

        if (visible) fetchDropdownData()
    }, [visible])

    // pre-fill form
    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                name: initialData.name,
                movie: initialData.movie?._id,
                theatre: initialData.theatre?._id,
                date: initialData.date ? dayjs(initialData.date) : null,
                totalSeats: initialData.totalSeats,
                ticketPrice: initialData.ticketPrice,
            })
        } else {
            form.resetFields()
            // if coming from TheatreList "Add Show", pre-select that theatre
            if (preselectedTheatre) {
                form.setFieldsValue({ theatre: preselectedTheatre._id })
            }
        }
    }, [initialData, preselectedTheatre, form, visible])

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()

            const payload = {
                ...values,
                date: values.date ? values.date.toISOString() : null,
            }

            if (isEditMode) {
                await onUpdateSuccess(initialData._id, payload)
            } else {
                const response = await addShow(payload)
                console.log(response)
                message.success("Show added successfully")
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
            title={isEditMode ? "Edit Show" : "Add Show"}
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
            width={560}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Show Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter show name" }]}
                >
                    <Input placeholder="e.g. Interstellar - Morning Show" />
                </Form.Item>

                <Form.Item
                    label="Movie"
                    name="movie"
                    rules={[{ required: true, message: "Please select a movie" }]}
                >
                    <Select placeholder="Select movie" showSearch optionFilterProp="children">
                        {movies.map((movie) => (
                            <Select.Option key={movie._id} value={movie._id}>
                                {movie.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Theatre"
                    name="theatre"
                    rules={[{ required: true, message: "Please select a theatre" }]}
                >
                    <Select
                        placeholder="Select theatre"
                        showSearch
                        optionFilterProp="children"
                        disabled={!!preselectedTheatre && !isEditMode}
                    >
                        {theatres.map((theatre) => (
                            <Select.Option key={theatre._id} value={theatre._id}>
                                {theatre.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Date & Time"
                    name="date"
                    rules={[{ required: true, message: "Please select date and time" }]}
                >
                    <DatePicker
                        showTime
                        style={{ width: "100%" }}
                        format="YYYY-MM-DD HH:mm"
                    />
                </Form.Item>

                <Form.Item
                    label="Total Seats"
                    name="totalSeats"
                    rules={[{ required: true, message: "Please enter total seats" }]}
                >
                    <InputNumber min={1} style={{ width: "100%" }} placeholder="e.g. 200" />
                </Form.Item>
                <Form.Item
                    label="Ticket Price"
                    name="ticketPrice"
                    rules={[{ required: true, message: "Please enter the ticket price" }]}
                >
                    <InputNumber min={1} style={{ width: "100%" }} placeholder="e.g. 500" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ShowsForm