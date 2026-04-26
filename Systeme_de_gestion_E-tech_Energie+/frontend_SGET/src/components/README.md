# E-tech Energie Layout Component

A modern, responsive dashboard layout component with sidebar navigation for the E-tech Energie management system.

## Features

### Layout Component
- **Asymmetric Sidebar**: Glass-morphism design with gradient backgrounds
- **Responsive Design**: Mobile hamburger menu with smooth transitions
- **Active Route Highlighting**: Visual indicators for current page
- **User Info Display**: Avatar, name, email, and role badges
- **Theme Toggle**: Dark/light mode switcher (UI ready)
- **Notifications Panel**: Dropdown notification system
- **User Profile Menu**: Quick access to settings and logout
- **Smooth Animations**: All interactions have polished transitions

### UI Components Library

#### Button
```jsx
import { Button } from '@/components';

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```

**Variants**: `primary`, `secondary`, `energy`, `tech`, `ghost`, `danger`
**Sizes**: `sm`, `md`, `lg`, `xl`

#### Card
```jsx
import { Card } from '@/components';

<Card glass hover>
  <Card.Header gradient>Header</Card.Header>
  <Card.Content>Content</Card.Content>
  <Card.Footer>Footer</Card.Footer>
</Card>
```

**Props**:
- `glass`: Enable glass-morphism effect
- `hover`: Add hover animation

#### Badge
```jsx
import { Badge } from '@/components';

<Badge variant="admin" size="md">Admin</Badge>
```

**Variants**: `default`, `primary`, `energy`, `tech`, `success`, `warning`, `danger`, `admin`, `secretaire`

#### Avatar
```jsx
import { Avatar } from '@/components';

<Avatar src={user.avatar} alt={user.name} size="lg" />
```

**Sizes**: `xs`, `sm`, `md`, `lg`, `xl`

#### Input
```jsx
import { Input } from '@/components';

<Input
  label="Email"
  type="email"
  placeholder="user@example.com"
  error={errorMessage}
  icon={<MailIcon />}
/>
```

#### Spinner
```jsx
import { Spinner } from '@/components';

<Spinner size="md" color="primary" />
```

**Colors**: `primary`, `energy`, `tech`, `white`

#### Toast Notifications
```jsx
import { useToast } from '@/components';

const { toast } = useToast();

toast.success('Operation completed!');
toast.error('Something went wrong');
toast.info('New message');
toast.warning('Please check your input');
```

## Usage

### Basic Setup

```jsx
import { Layout } from '@/components';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
```

### Navigation Structure

The sidebar includes the following navigation items:
- Dashboard (`/dashboard`)
- Clients (`/clients`)
- Products (`/products`)
- Documents (`/documents`)
- Settings (`/settings`)

### Color Scheme

The layout uses the E-tech Energie brand colors:
- **Primary Blue**: Professional, trustworthy
- **Energy Green**: Dynamic, growth
- **Tech Blue**: Innovation, technology

## Styling

### Glass-morphism Effect
```jsx
<div className="bg-white/10 backdrop-blur-xl border border-white/20">
  Content
</div>
```

### Gradients
```jsx
<div className="bg-gradient-to-r from-primary-500 to-energy-500">
  Content
</div>
```

### Shadow Effects
```jsx
<div className="shadow-lg shadow-primary-500/30">
  Content
</div>
```

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- High contrast ratios for readability
- Focus indicators on all interactive elements

## Responsive Breakpoints

- **Mobile**: `< 1024px` - Sidebar hidden, hamburger menu
- **Desktop**: `≥ 1024px` - Sidebar always visible

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized re-renders using React hooks
- CSS transitions instead of JavaScript animations
- Lazy loading support for route components
- Minimal bundle size with tree-shaking

## Future Enhancements

- Full dark mode implementation
- Collapsible sidebar sections
- Custom theme colors
- Widget support for dashboard
- Multi-language support
