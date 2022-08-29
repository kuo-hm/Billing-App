import { render } from '@testing-library/react'
import { Budget } from '../components/dashboard/budget'

it('renders homepage unchanged', () => {
    const { container } = render(<Budget data={55} />)
  expect(container).toMatchSnapshot()
})