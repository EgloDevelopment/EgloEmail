// Main index page (NO-AUTH)
import React, { useState, useEffect } from 'react';


// UI imports
import { Button, ButtonGroup } from "@nextui-org/react";
import { Input } from "@nextui-org/react";


// Function imports
import makePostRequest from '@/functions/make-post-request';
import Cookies from "js-cookie";

// Start of page
export default function Page() {
    const [serverURL, setServerURL] = useState("example.com")

    const [error, setError] = useState([])

    const [loginLoading, setLoginLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    async function login() {
        setLoginLoading(true)

        await makePostRequest("/api/auth/login", {
            email: email,
            password: password
        }).then((response) => {
            if (response.error === true) {
                setError({
                    field: response.fields[0].toLowerCase(),
                    message: response.data,
                });
            } else {
                setError([])
                Cookies.set("token", response.token, { sameSite: "strict" });

                Cookies.set("email", response.email, { sameSite: "strict" });

                Cookies.set("get_token", response.get_token, { sameSite: "strict" });
                Cookies.set("send_token", response.send_token, { sameSite: "strict" });
                Cookies.set("sent_token", response.sent_token, { sameSite: "strict" });

                window.location.href = "/app"
            }
        })

        setLoginLoading(false)
    }

    useEffect(() => {
        let url = window.location.hostname.split('.')
        setServerURL(`${url[tokens.length - 2]}.${url[tokens.length - 1]}`)
    }, []);

    return (
        <main>
            <div className="h-screen flex items-center justify-center">
                <div className="form-control w-full max-w-xs">

                    <Input
                        type="email"
                        placeholder={"testing@" + serverURL}
                        label="Email"
                        variant="bordered"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="max-w-xs"
                        isInvalid={error.field === "email" && true}
                        errorMessage={error.field === "email" && error.message}
                        fullWidth
                    />

                    <Input
                        type="password"
                        placeholder="Account password"
                        label="Password"
                        variant="bordered"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="max-w-xs mt-3"
                        isInvalid={error.field === "password" && true}
                        errorMessage={error.field === "password" && error.message}
                        fullWidth
                    />



                    <Button
                        color="primary"
                        className="max-w-xs mt-5"
                        onClick={() => login()}
                        isLoading={loginLoading}
                        fullWidth
                    >
                        Login
                    </Button>

                </div>
            </div>
        </main>
    );
}
