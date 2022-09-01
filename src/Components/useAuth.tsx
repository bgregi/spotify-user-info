import { useState, useEffect } from "react"
import axios from 'axios'
import { codeState } from "../state/atom"
import { useRecoilValue } from "recoil"

export default function useAuth() {
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()
    const code = useRecoilValue(codeState)


    useEffect(() => {
        axios.post('https://spotify-test-server.herokuapp.com/login', {
            code,
        }).then(res => {
            setAccessToken(res.data.accessToken)
            setRefreshToken(res.data.refreshToken)
            setExpiresIn(res.data.expiresIn)
            window.history.pushState({}, '', '/')
        }).catch((err) => {
            console.log(`error caught on userAuth login request: ${err}`)
            window.location.href = '/'
        })
    }, [code])

    useEffect(() => {
        if (!refreshToken || !expiresIn) return
        const interval = setInterval(() => {

            axios.post('https://spotify-test-server.herokuapp.com/refresh', {
                refreshToken,
            }).then(res => {
                setAccessToken(res.data.accessToken)
                setExpiresIn(res.data.expiresIn)
            }).catch((err) => {
                console.log(`error caught on userAuth refresh request: ${err}`)
                window.location.href = '/'
            })
        }, (expiresIn - 60) * 1000)
        return () => clearInterval(interval)
    }, [refreshToken, expiresIn])

    return accessToken
}