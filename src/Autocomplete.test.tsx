import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Autocomplete from './Autocomplete'

const user = userEvent.setup()

// eslint-disable-next-line jest/require-top-level-describe
beforeEach(() => {
  jest.spyOn(global.Math, 'random').mockReturnValue(0.01)
})

// eslint-disable-next-line jest/require-top-level-describe
afterEach(() => {
  jest.spyOn(global.Math, 'random').mockRestore()
})

describe('basis', () => {
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

  it('listitem style', async () => {
    expect.assertions(4)

    const options = ['123', '124', '125', '234', '2345']
    render(<Autocomplete placeholder="type text" options={options} />)

    const input = screen.getByPlaceholderText('type text')
    await user.pointer({ target: input, keys: '[MouseLeft]' })
    await user.keyboard('1')

    await expect(screen.findByText('123')).resolves.toHaveStyle({
      background: 'rgba(0, 0, 0, 0.04)',
    })

    const items = screen
      .getAllByRole('listitem')
      .filter(el => el.textContent !== '123')
    expect(items).toHaveLength(2)
    items.forEach(el =>
      expect(el).not.toHaveStyle({ background: 'rgba(0, 0, 0, 0.04)' })
    )
  })
})

describe('interaction', () => {
  it('match option', async () => {
    expect.assertions(2)

    const options = ['123', '124', '125', '234', '2345']
    render(<Autocomplete placeholder="type text" options={options} />)

    const input = screen.getByPlaceholderText('type text')
    await user.pointer({ target: input, keys: '[MouseLeft]' })
    await user.keyboard('1')

    await expect(screen.findByText(/125/i)).resolves.toBeInTheDocument()
    expect(screen.queryAllByRole('listitem')).toHaveLength(3)
  })

  it('not match option', async () => {
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
    await waitFor(() => {
      // eslint-disable-next-line jest/no-conditional-in-test
      if (screen.queryByRole('listitem')) throw new Error('等待渲染完成')
    })

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()

    await user.pointer({ target: input, keys: '[MouseLeft]' })
    await screen.findAllByRole('listitem')
    expect(screen.queryAllByRole('listitem')).toHaveLength(3)
  })

  it('select listitem', async () => {
    expect.assertions(3)

    const options = ['123', '124', '125', '234', '2345']
    render(<Autocomplete placeholder="type text" options={options} />)

    const input = screen.getByPlaceholderText('type text')
    await user.pointer({ target: input, keys: '[MouseLeft]' })
    await user.keyboard('1')

    await user.pointer({
      target: await screen.findByText('123'),
      keys: '[MouseLeft]',
    })
    await waitFor(() => {
      // eslint-disable-next-line jest/no-conditional-in-test
      if (screen.queryByRole('listitem')) throw new Error('等待渲染完成')
    })

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveValue('123')
    expect(screen.getByRole('textbox')).toHaveFocus()
  })

  it('hover listitem', async () => {
    expect.assertions(4)

    const options = ['123', '124', '125', '234', '2345']
    render(<Autocomplete placeholder="type text" options={options} />)

    const input = screen.getByPlaceholderText('type text')
    await user.pointer({ target: input, keys: '[MouseLeft]' })
    await user.keyboard('1')
    await user.hover(await screen.findByText('124'))

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

  it('type long text', async () => {
    expect.assertions(2)
    const alert = jest.fn()
    global.alert = alert

    const options = ['123', '124', '125', '234', '2345']
    render(<Autocomplete placeholder="type text" options={options} />)

    const input = screen.getByPlaceholderText('type text')
    await user.pointer({ target: input, keys: '[MouseLeft]' })
    await user.keyboard('1111111111111111111111111111111')

    expect(alert.mock.calls).toHaveLength(1)

    await user.keyboard('[Backspace][Backspace]')

    await expect(screen.findByText('loading...')).resolves.toBeInTheDocument()
  })
})
