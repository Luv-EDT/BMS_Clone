import { Tabs } from "antd"
import Navbar from "../Navbar"
import TheatreList from "../Theatres/TheatreList"

const { TabPane } = Tabs

function Profile() {
    return (
        <div>
            <Navbar />
            <div style={{ padding: 24 }}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Bookings" key="1">
                        <div>Bookings coming soon</div>
                    </TabPane>

                    <TabPane tab="Theatres" key="2">
                        <TheatreList />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}

export default Profile