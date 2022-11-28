import {
  ChangeEventHandler,
  FC,
  MouseEventHandler,
  useState,
  FocusEventHandler,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react'
import { css } from 'styled-components'
import { from, fromEvent, Observable, race } from 'rxjs'
import {
  debounceTime,
  filter,
  map,
  mergeMap,
  share,
  take,
  tap,
} from 'rxjs/operators'

interface AutocompleteProps {
  options?: string[]
  placeholder?: string
}

const useDebounce = <T,>(
  initialState: T | (() => T),
  delay = 10
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState(initialState)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  const clearTimer = (): void => {
    if (timer.current !== undefined) {
      clearTimeout(timer.current)
      timer.current = undefined
    }
  }
  const changeState = (value: T | ((prevState: T) => T)): void => {
    clearTimer()
    timer.current = setTimeout(() => {
      setState(value)
    }, delay)
  }
  useEffect(() => clearTimer, [])

  return [state, changeState]
}

type User = {
  id: string
  name: string
}

const Autocomplete: FC<AutocompleteProps> = ({ options = [], placeholder }) => {
  const [value, setValue] = useState('')
  const [active, setActive] = useState(0)
  const [open, setOpen] = useDebounce(false)
  const [focus, setFocus] = useDebounce(false)
  const [loading, setLoading] = useState(false)
  const selectRef = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [result, setSearchResults] = useState<User[]>([])

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    setValue(e.target.value)
    setOpen(true)
  }

  const handleBlur: FocusEventHandler<HTMLInputElement> = () => {
    if (!selectRef.current) setFocus(false)
    else {
      inputRef.current!.focus()
      selectRef.current = false
    }
    setOpen(false)
  }

  const handleFocus: FocusEventHandler<HTMLInputElement> = () => {
    if (!selectRef.current) setOpen(true)
    setFocus(true)
  }

  const handleSelect: MouseEventHandler<HTMLLIElement> = (): void => {
    selectRef.current = true
    setFocus(true)
    setValue(result[active].name)
    setOpen(false)
    setActive(0)
  }

  useEffect(() => {
    if (!inputRef.current) return

    const input$: Observable<string> = fromEvent<KeyboardEvent>(
      inputRef.current,
      'keyup'
    ).pipe(
      map(e => (e.target as HTMLInputElement).value),
      share()
    )

    const searchQuery = (search: string) => {
      const users = options.map(str => ({ id: str, name: str }))
      return new Promise(function (resolve, _reject) {
        setTimeout(() => {
          resolve(users.filter(user => user.name.indexOf(search) === 0))
        }, Math.random() * 1000)
      })
    }

    const toggleWarning = (isShow: boolean) => {
      if (isShow) alert('您输入的字符数过多!')
    }

    const reInput$ = input$
    const subs1 = input$
      .pipe(
        debounceTime(500),
        filter(str => str.length <= 30),
        tap(str => str.length === 0 && setSearchResults([])),
        filter(str => !!str),
        mergeMap<string, Observable<User[]>>(str => {
          setLoading(true)
          return race(from(searchQuery(str)), reInput$).pipe(
            tap(() => setLoading(false)),
            filter(v => typeof v !== 'string')
          ) as Observable<User[]>
        }),
        tap((res: User[]) => setSearchResults(res))
      )
      .subscribe()

    const subs = input$
      .pipe(
        mergeMap(str =>
          str.length <= 30
            ? input$.pipe(
                take(1),
                filter(s => s.length > 30)
              )
            : input$.pipe(
                take(1),
                filter(s => s.length <= 30)
              )
        )
      )
      .subscribe(str => {
        toggleWarning(str.length > 30)
      })
    return () => {
      subs.unsubscribe()
      subs1.unsubscribe()
    }
  }, [options])

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
          &:hover {
            border-color: #4096ff;
          }

          ${focus
            ? css`
                border-color: #4096ff;
                box-shadow: 0 0 0 2px #0591ff1a;
              `
            : ''}
        `}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
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
      {((!!result.length && open) || loading) && (
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
          {loading
            ? 'loading...'
            : result.map((user, i) => (
                <li
                  key={user.id}
                  onMouseEnter={() => setActive(i)}
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
                    ${active === i
                      ? 'background-color: rgba(0, 0, 0, 0.04);'
                      : ''}
                  `}
                  onMouseDown={handleSelect}
                >
                  {user.name}
                </li>
              ))}
        </ul>
      )}
    </div>
  )
}

export default Autocomplete
