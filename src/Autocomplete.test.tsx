import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Autocomplete from './Autocomplete'

const user = userEvent.setup()

describe('emtpy options', () => {
  it('default render', () => {
    expect.assertions(1)
    render(<Autocomplete />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('placeholder render', () => {
    expect.assertions(1)
    render(<Autocomplete placeholder="type text" />)
    const input = screen.getByPlaceholderText('type text')
    expect(input).toBeInTheDocument()
  })

  it('type text', async () => {
    expect.assertions(3)
    render(<Autocomplete placeholder="type text" />)
    const input = screen.getByPlaceholderText('type text')

    await user.pointer({ target: input, keys: '[MouseLeft]' })
    await user.keyboard('test')
    expect(screen.getByDisplayValue(/test/i)).toBeInTheDocument()

    await user.keyboard('[Backspace]')
    expect(screen.queryByDisplayValue(/test/i)).not.toBeInTheDocument()
    expect(screen.getByDisplayValue(/tes/i)).toBeInTheDocument()
  })
})

describe('provide options', () => {
  it('match options', async () => {
    expect.assertions(2)
    const options = ['123', '124', '125', '234', '2345']
    render(<Autocomplete placeholder="type text" options={options} />)
    const input = screen.getByPlaceholderText('type text')
    await user.pointer({ target: input, keys: '[MouseLeft]' })
    await user.keyboard('1')
    expect(screen.getByText(/125/i)).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem')).toHaveLength(3)
  })

  it('no match options', async () => {
    expect.assertions(1)
    const options = ['123', '124', '125', '234', '2345']
    render(<Autocomplete placeholder="type text" options={options} />)
    const input = screen.getByPlaceholderText('type text')
    await user.pointer({ target: input, keys: '[MouseLeft]' })
    await user.keyboard('6')
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('blur and focus textbox', async () => {
    expect.assertions(2)
    const options = ['123', '124', '125', '234', '2345']
    render(
      <>
        <Autocomplete placeholder="type text" options={options} />
        <div data-testid="blank" />
      </>
    )
    const input = screen.getByPlaceholderText('type text')
    await user.pointer({ target: input, keys: '[MouseLeft]' })
    await user.keyboard('1')
    await user.pointer({
      target: screen.getByTestId('blank'),
      keys: '[MouseLeft]',
    })
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    await user.pointer({ target: input, keys: '[MouseLeft]' })
    expect(screen.queryAllByRole('listitem')).toHaveLength(3)
  })

  it('listitem style', async () => {
    expect.assertions(4)
    const options = ['123', '124', '125', '234', '2345']
    render(<Autocomplete placeholder="type text" options={options} />)
    const input = screen.getByPlaceholderText('type text')
    await user.pointer({ target: input, keys: '[MouseLeft]' })
    await user.keyboard('1')

    const items = screen
      .getAllByRole('listitem')
      .filter(el => el.textContent !== '123')
    expect(screen.getByText('123')).toHaveStyle({
      background: 'rgba(0, 0, 0, 0.04)',
    })
    expect(items).toHaveLength(2)
    items.forEach(el =>
      expect(el).not.toHaveStyle({ background: 'rgba(0, 0, 0, 0.04)' })
    )
  })

  it('listitem hover style', async () => {
    expect.assertions(4)
    const options = ['123', '124', '125', '234', '2345']
    render(<Autocomplete placeholder="type text" options={options} />)
    const input = screen.getByPlaceholderText('type text')
    await user.pointer({ target: input, keys: '[MouseLeft]' })
    await user.keyboard('1')

    await user.hover(screen.getByText('124'))
    expect(screen.getByText('124')).toHaveStyle({
      background: 'rgba(0, 0, 0, 0.04)',
    })

    const items = screen
      .getAllByRole('listitem')
      .filter(el => el.textContent !== '124')
    expect(items).toHaveLength(2)
    items.forEach(el =>
      expect(el).not.toHaveStyle({ background: 'rgba(0, 0, 0, 0.04)' })
    )
  })

  it('select option', async () => {
    expect.assertions(2)
    const options = ['123', '124', '125', '234', '2345']
    render(<Autocomplete placeholder="type text" options={options} />)
    const input = screen.getByPlaceholderText('type text')
    await user.pointer({ target: input, keys: '[MouseLeft]' })
    await user.keyboard('1')
    const item = screen.getByText('123')
    await user.pointer({ target: item, keys: '[MouseLeft]' })

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveValue('123')
  })
})
