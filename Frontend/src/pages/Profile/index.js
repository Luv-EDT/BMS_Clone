import { Tabs } from "antd"
import Navbar from "../Navbar"
import TheatreList from "../Theatres/TheatreList"
import ShowsList from "../Shows/ShowsList"
import { useState } from "react"

const { TabPane } = Tabs

function Profile() {
        const [refreshShows, setRefreshShows] = useState(0)

    return (
        <div>
            <Navbar />
            <div style={{ padding: 24 }}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Shows" key="1">
                        <div>    <ShowsList refreshShows={refreshShows}/></div>
                    </TabPane>

                    <TabPane tab="Theatres" key="2">
                        <TheatreList   onShowAdded={() => setRefreshShows((prev) => prev + 1)}
/>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}

export default Profile