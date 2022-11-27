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
  await userEvent.type(textbox, '1', { delay: 100 })
}
