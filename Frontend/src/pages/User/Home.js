import { Tabs } from "antd"
import MoviesAll from "./MoviesAll"
import Bookings from "./Bookings"
import Navbar from "../Navbar"
import { useEffect } from "react"

const { TabPane } = Tabs

function Home() {

    return (
        <div>
            <Navbar />
            <div style={{ padding: 24 }}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Movies" key="1">
                        <MoviesAll />
                    </TabPane>

                    <TabPane tab="Your Bookings" key="2">
                        <div><Bookings/></div>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}

export default Home