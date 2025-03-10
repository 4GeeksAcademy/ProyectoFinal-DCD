
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/register.css";


export const Register = () => {
    const { store, actions } = useContext(Context)
    const navigate = useNavigate()

    const [userData, setUserData] = useState({
        email: "",
        password: "",
        name: ""
    })

    const [errorData, setErrorData] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value })

        actions.setUser({ ...store, [name]: value })
    }

    const sendData = async (e) => {
        e.preventDefault()

        if (store.email && store.password && store.name) {
            if (!validateEmail(userData.email)) {
                setErrorData(<p className="text-danger">Formato de email inválido.</p>)
                return;
            } else {
                try {
                    const registerSuccess = await actions.register(store.email, store.password, store.name)

                    if (registerSuccess) {
                        const loginSuccess = await actions.login(store.email, store.password)

                        if (loginSuccess) {
                            console.log("Usuario registrado y logueado correctamente.")
                            actions.clearUser()
                            navigate("/registerData")
                        } else {
                            console.log("Error al iniciar sesión después del registro.")
                        }
                    }
                } catch (error) {
                    setErrorData(<p className="text-danger">Already registered email.</p>)
                    console.error("Error en el proceso de registro/login:", error)
                }
            }
        } else {
            setErrorData(<p className="text-danger">Required fields.</p>)
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    useEffect(() => {
        if (store.email === "" && store.password === "" && store.name === "") {
            setUserData({ email: "", password: "", name: "" })
        }
    }, [store.email, store.password, store.name])



    return (
        <div className="d-flex justify-content-center home-body">
            <div className="container align-items-center row text-white">
                <div className=" p-5 col-4 flex-b">
                    <form>
                        <h1 className="pb-5">Welcome!</h1>

                        <div className="form-group pb-3">
                            <label className="py-2">Name</label>
                            <input type="text" className="form-control" name="name" id="InputName" value={userData.name} onChange={handleChange} placeholder="Name" />
                        </div>
                        <div className="form-group pb-3">
                            <span className="py-2">Email address</span>
                            <input type="email" className="form-control" name="email" id="InputEmail" value={userData.email} onChange={handleChange} aria-describedby="emailHelp" placeholder="Enter email" />
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>

                        <div className="form-group pb-3">
                            <label className="py-2">Password</label>
                            <input type="password" className="form-control" name="password" id="InputPassword" value={userData.password} onChange={handleChange} placeholder="Password" />
                            {errorData !== "" ? errorData : <></>}
                        </div>
                        <div className="d-flex justify-content-center">
                            <div className="py-">
                                <button type="submit" className="btn btn-warning" onClick={sendData}>Join Now!</button>
                            </div>

                            <Link to="/">
                                <button className="btn btn-warning  ms-5">Home</button>
                            </Link>

                        </div>
                    </form>
                </div>

                <div className="col-6 align-items-center">
                    <img src="https://cdn.pixabay.com/photo/2017/01/09/11/30/dumbbell-1966247_1280.jpg" style={{ maxHeight: "125%", maxWidth: "125%" }}></img>
                </div>

            </div>
        </div>
    )
}