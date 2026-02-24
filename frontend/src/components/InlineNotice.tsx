interface InlineNoticeProps {
  message: string;
  variant?: 'success' | 'error';
}

export function InlineNotice({ message, variant = 'success' }: InlineNoticeProps) {
  return (
    <div className={`inline-notice ${variant === 'error' ? 'inline-notice-error' : 'inline-notice-success'}`}>
      {message}
    </div>
  );
}
