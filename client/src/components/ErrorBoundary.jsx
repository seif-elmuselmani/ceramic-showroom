import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { RefreshCw, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught React Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5 text-center my-5">
          <div className="p-5 bg-white rounded-4 shadow-lg border max-w-lg mx-auto">
            <AlertTriangle size={54} className="text-warning mb-3 animate-bounce" />
            <h3 className="fw-bold text-dark mb-2">حدث تنبيه مؤقت في استعراض الأصناف</h3>
            <p className="text-muted mb-4">
              تم حماية الصفحة وتفادي توقف الموقع. انقر على الزر أدناه لتحديث الكتالوج وعرض الأصناف بشكل جديد.
            </p>
            <Button 
              variant="warning" 
              className="fw-bold text-dark px-4 py-2.5 rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
              onClick={this.handleReload}
            >
              <RefreshCw size={18} />
              تحديث واستعادة الكتالوج
            </Button>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
