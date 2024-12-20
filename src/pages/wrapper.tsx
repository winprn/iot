export default function WrapperPage({ children, ...rest }) {
  const user = localStorage.getItem('user');

  if (!user) {
    window.location.href = '/login';
  }
  return children;
}
