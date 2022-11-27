import Autocomplete from './Autocomplete'

function App() {
  const options = ['126', '124', '125', '234', '2345']
  return <Autocomplete options={options} placeholder="type text" />
}

export default App
