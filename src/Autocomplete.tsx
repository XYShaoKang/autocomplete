import { ChangeEventHandler, FC, useState, useMemo } from 'react'
import { css } from 'styled-components'

interface AutocompleteProps {
  options?: string[]
  placeholder?: string
}

const Autocomplete: FC<AutocompleteProps> = ({ options = [], placeholder }) => {
  const [value, setValue] = useState('')

  const showOptions = useMemo(
    () => (value ? options.filter(v => v.indexOf(value) === 0) : []),
    [value, options]
  )

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    setValue(e.target.value)
  }

  return (
    <div
      css={css`
        position: relative;
        width: 200px;
        box-sizing: border-box;
      `}
    >
      <div
        css={css`
          border-radius: 4px;
          margin: 0;
          padding: 0;
          border: 1px #d9d9d9 solid;
          height: 32px;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          color: rgba(0, 0, 0, 0.88);
          cursor: pointer;
          &:hover,
          &:focus-within {
            border-color: #4096ff;
          }
          &:focus-within {
            box-shadow: 0 0 0 2px #0591ff1a;
          }
        `}
      >
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          css={css`
            box-sizing: border-box;
            width: 100%;
            margin: 0;
            background: transparent;
            border: none;
            outline: none;
            appearance: none;
            height: 30px;
            cursor: auto;
            padding: 0 11px;
          `}
        />
      </div>
      {!!showOptions.length && (
        <ul
          css={css`
            position: absolute;
            margin: 4px 0 0;
            padding: 8px;
            box-shadow: 0 6px 16px 0 rgb(0 0 0 / 8%),
              0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%);
            width: 100%;
            border-radius: 8px;
            box-sizing: border-box;
          `}
        >
          {showOptions.map(v => (
            <li
              key={v}
              css={css`
                margin: 0;
                padding: 0;
                list-style: none;
                min-height: 32px;
                padding: 5px 12px;
                color: rgba(0, 0, 0, 0.88);
                font-size: 14px;
                box-sizing: border-box;
                cursor: pointer;
                transition: background 0.3s ease;
                border-radius: 4px;
                display: flex;

                &:hover {
                  background-color: rgba(0, 0, 0, 0.04);
                }
              `}
            >
              {v}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Autocomplete
