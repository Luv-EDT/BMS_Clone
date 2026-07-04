import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "../store/userSlice"
import { Drawer, Button, Avatar, Divider } from "antd"
import { UserOutlined } from "@ant-design/icons"

function Navbar() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.user)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [userState, setUserState] = useState(user)

    const handleLogout = () => {
        dispatch(setUser({
        }))
        setDrawerOpen(false)
        setUserState(null)
        localStorage.removeItem("token")
        navigate("/login")
    }


    return (

        <>
            <nav style={styles.navbar}>
                <span
                    style={styles.brand}
                    onClick={() => navigate("/")}
                >
                    Book Luv's Shows
                </span>

                <Avatar
                    size={38}
                    icon={<UserOutlined />}
                    style={styles.avatar}
                    onClick={() => setDrawerOpen(true)}
                />
            </nav>

            <Drawer
                title="Profile"
                placement="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                width={280}
            >
                {user ? (
                    // ---- Logged In ----
                    <div style={styles.drawerContent}>
                        <Avatar
                            size={64}
                            icon={<UserOutlined />}
                            style={styles.drawerAvatar}
                        />

                        <h3 style={styles.userName}>
                            {user.name}
                        </h3>

                        <Divider />

                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>Email</span>
                            <span style={styles.infoValue}>{user.userId}</span>
                        </div>

                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>Role</span>
                            <span style={styles.infoValue}>{user.role || "User"}</span>
                        </div>

                        <Divider />

                        <Button
                            danger
                            block
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    // ---- Logged Out ----
                    <div style={styles.drawerContent}>
                        <Avatar
                            size={64}
                            icon={<UserOutlined />}
                            style={styles.drawerAvatar}
                        />

                        <p style={styles.guestText}>
                            You are not logged in
                        </p>

                        <Divider />

                        <Button
                            type="primary"
                            block
                            style={{ marginBottom: 12 }}
                            onClick={() => {
                                navigate("/login")
                                setDrawerOpen(false)
                            }}
                        >
                            Login
                        </Button>

                        <Button
                            block
                            onClick={() => {
                                navigate("/register")
                                setDrawerOpen(false)
                            }}
                        >
                            Register
                        </Button>
                    </div>
                )}
            </Drawer>
        </>
    )
}

const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        height: 60,
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 100,
    },
    brand: {
        fontSize: 20,
        fontWeight: 700,
        cursor: "pointer",
        color: "#1677ff",
    },
    avatar: {
        cursor: "pointer",
        backgroundColor: "#1677ff",
    },
    drawerContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 12,
    },
    drawerAvatar: {
        backgroundColor: "#1677ff",
        marginBottom: 12,
    },
    userName: {
        margin: 0,
        fontSize: 16,
    },
    guestText: {
        color: "#888",
        marginBottom: 8,
    },
    infoRow: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 12,
    },
    infoLabel: {
        color: "#888",
        fontSize: 14,
    },
    infoValue: {
        fontWeight: 600,
        fontSize: 14,
    },
}

export default Navbar