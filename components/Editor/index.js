import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import axios from 'axios'
import styles from './Editor.module.css'

export default forwardRef((props, ref) => {
    const inputRef = useRef();
    const [value, setValue] = useState('');
    const [options, setOptions] = useState([]);

    function inputHandler(e) {
        setValue(e.target.value);
    }

    useImperativeHandle(ref, () => {
        return {
            getValue: () => {
                return value;
            },
            afterGuiAttached: () => {
                setValue(props.value);
                inputRef.current.focus();
                inputRef.current.select();
            }
        };
    });

    async function fetchItemData(description) {

        return axios.get('https://fakestoreapi.com/products')
            .then((response) => {
                return response.data
            }).catch((error) => {
                return []
            })
    }

    async function handleKeyDown(evt) {
        const vl = evt.target.value
        if (evt.keyCode === 40) {
            const opt = await fetchItemData()
            const filtered = opt.filter(item => {
                return item.title.includes(vl)
            })
            setOptions(filtered)
        }

    }

    return (
        <div>
            <input
                type="text"
                className={styles.inputText}
                ref={inputRef}
                onChange={inputHandler}
                value={value}
                placeholder={'Selecione o item'}
                onKeyDown={handleKeyDown}
            />
            <div>
                <ul
                    className={styles.ulOption}
                    hidden={options.length < 1}
                >
                    {options.map(item => {
                        return <li
                            className={styles.liOption}
                            onClick={() => {
                                props.setSelectedValue({
                                    id: item.id,
                                    label: item.title
                                })
                                setValue(item.id + ' - ' + item.title)
                                setOptions([])
                            }}>
                            {item.id + ' - ' + item.title}
                        </li>
                    })}
                </ul>
            </div>
        </div>
    )
})