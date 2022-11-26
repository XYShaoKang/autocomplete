import { ComponentStory, ComponentMeta } from '@storybook/react'
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
