import React, { useState } from 'react'
import s2 from '../../s1-main/App.module.css'
import s from './HW13.module.css'
import SuperButton from '../hw04/common/c2-SuperButton/SuperButton'
import axios from 'axios'
import success200 from './images/200.svg'
import error400 from './images/400.svg'
import error500 from './images/500.svg'
import errorUnknown from './images/error.svg'

const HW13 = () => {
    const [code, setCode] = useState('')
    const [text, setText] = useState('')
    const [info, setInfo] = useState('')
    const [image, setImage] = useState('')
    const [loading, setLoading] = useState(false) // Состояние для блокировки кнопок

    const send = (x?: boolean | null) => async () => {
        const url =
            x === null
                ? 'https://xxxxxx.ccc' // Имитация ошибки запроса
                : 'https://samurai.it-incubator.io/api/3.0/homework/test'

        setLoading(true) // Блокируем кнопки
        setCode('')
        setImage('')
        setText('')
        setInfo('...loading')

        try {
            const res = await axios.post(url, { success: x })
            setCode('Код 200!')
            setImage(success200)
            setInfo(res.data.info)
            setText(res.data.errorText)
        } catch (e: any) {
            const errorCode = e.response?.status

            if (errorCode === 400) {
                setCode('Ошибка 400!')
                setImage(error400)
                setText(e.response.data.errorText)
                setInfo(e.response.data.info)
            } else if (errorCode === 500) {
                setCode('Ошибка 500!')
                setImage(error500)
                setText(e.response.data.errorText)
                setInfo(e.response.data.info)
            } else {
                console.log(e)
                setCode('Error')
                setImage(errorUnknown)
                setText('Network Error')
                setInfo('Axios Error')
            }
        } finally {
            setLoading(false) // Разблокируем кнопки
        }
    }

    return (
        <div id={'hw13'}>
            <div className={s2.hwTitle}>Homework #13</div>

            <div className={s2.hw}>
                <div className={s.buttonsContainer}>
                    <SuperButton
                        id={'hw13-send-true'}
                        onClick={send(true)}
                        xType={'secondary'}
                        disabled={loading}
                    >
                        Send true
                    </SuperButton>
                    <SuperButton
                        id={'hw13-send-false'}
                        onClick={send(false)}
                        xType={'secondary'}
                        disabled={loading}
                    >
                        Send false
                    </SuperButton>
                    <SuperButton
                        id={'hw13-send-undefined'}
                        onClick={send(undefined)}
                        xType={'secondary'}
                        disabled={loading}
                    >
                        Send undefined
                    </SuperButton>
                    <SuperButton
                        id={'hw13-send-null'}
                        onClick={send(null)}
                        xType={'secondary'}
                        disabled={loading}
                    >
                        Send null
                    </SuperButton>
                </div>

                <div className={s.responseContainer}>
                    <div className={s.imageContainer}>
                        {image && <img src={image} className={s.image} alt="status" />}
                    </div>

                    <div className={s.textContainer}>
                        <div id={'hw13-code'} className={s.code}>
                            {code}
                        </div>
                        <div id={'hw13-text'} className={s.text}>
                            {text}
                        </div>
                        <div id={'hw13-info'} className={s.info}>
                            {info}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HW13
