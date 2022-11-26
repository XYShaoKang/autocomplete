import { ChangeEventHandler, FC, useState } from 'react'

interface AutocompleteProps {
  options?: string[]
  placeholder?: string
}

const Autocomplete: FC<AutocompleteProps> = ({
  options = [],
  placeholder,
} = {}) => {
  const [value, setValue] = useState('')
  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    setValue(e.target.value)
  }
  const showOptions = value ? options.filter(v => v.indexOf(value) === 0) : []

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {showOptions && (
        <ul>
          {showOptions.map(v => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Autocomplete
