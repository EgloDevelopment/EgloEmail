// Main index page (NO-AUTH)
import React, { useState, useEffect } from 'react';


// UI imports
import { Button, ButtonGroup } from "@nextui-org/react";
import { Input } from "@nextui-org/react";


// Function imports
import makePostRequest from '@/functions/make-post-request';


// Start of page
export default function Page() {
  const [serverURL, setServerURL] = useState("example.com")

  const [allowRegistering, setAllowRegistering] = useState(false)

  const [error, setError] = useState([])

  const [registerLoading, setRegisterLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function getAllowRegistering() {
    await makePostRequest("/api/auth/register-status").then((response) => {
      setAllowRegistering(response.allow_registering)
    })
  }

  async function register() {
    setRegisterLoading(true)

    await makePostRequest("/api/auth/register", {
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
        window.location.href = "/login"
      }
    })

    setRegisterLoading(false)
  }

  useEffect(() => {
    let url = window.location.hostname.split('.')
    setServerURL(`${url[tokens.length - 2]}.${url[tokens.length - 1]}`)
    
    getAllowRegistering()
  }, []);

  return (
    <main>

      {allowRegistering === true ? (
        <>

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
                placeholder="Secure password"
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
                onClick={() => register()}
                isLoading={registerLoading}
                fullWidth
              >
                Register
              </Button>

            </div>
          </div>

        </>
      ) : (
        <div className="h-screen flex items-center justify-center">
          <p>Register not allowed</p>
        </div>
      )}

    </main>
  );
}
