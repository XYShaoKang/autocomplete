import { ComponentStory, ComponentMeta } from '@storybook/react'
import { within, userEvent } from '@storybook/testing-library'

import Autocomplete from './Autocomplete'

export default {
  title: 'Example/Autocomplete',
  component: Autocomplete,
  argTypes: {},
} as ComponentMeta<typeof Autocomplete>

const Template: ComponentStory<typeof Autocomplete> = args => (
  <Autocomplete {...args} />
)

export const Defalut = Template.bind({})

export const ProvideOptions = Template.bind({})
ProvideOptions.args = {
  options: ['123', '124', '125', '234', '2345'],
}
ProvideOptions.play = async ({ canvasElement }): Promise<void> => {
  const canvas = within(canvasElement)

  const textbox = canvas.getByRole('textbox')
  await sleep(1000)
  await userEvent.type(textbox, '1', { delay: 100 })
}

export const SelectDemo = Template.bind({})
SelectDemo.args = {
  ...ProvideOptions.args,
}
SelectDemo.play = async ({ canvasElement }): Promise<void> => {
  const canvas = within(canvasElement)

  const textbox = canvas.getByRole('textbox')
  await sleep(1000)
  userEvent.type(textbox, '1')
  await sleep(1000)
  userEvent.click(await canvas.findByText('123'))
}

const sleep = (time: number) => new Promise(r => setTimeout(r, time))
