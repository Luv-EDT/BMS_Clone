import { Tabs } from "antd"
import MoviesList from "../Movies/MoviesList"
import TheatreAdminList from "./TheatreAdminList"
import Navbar from "../Navbar"
import { useEffect } from "react"

const { TabPane } = Tabs

function AdminHome() {

    return (
        <div>
            <Navbar />
            <div style={{ padding: 24 }}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Movies" key="1">
                        <MoviesList />
                    </TabPane>

                    <TabPane tab="Theatres" key="2">
                        <div><TheatreAdminList/></div>
                    </TabPane>

                    <TabPane tab="Tab 3" key="3">
                        <div>Tab 3 content coming soon</div>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}

export default AdminHome