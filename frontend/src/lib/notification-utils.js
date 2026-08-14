export const LABELS = {
  task_created: 'Task Created',
  task_updated: 'Task Updated',
  board_created: 'Board Created',
  board_updated: 'Board Updated',
  board_deleted: 'Board Deleted',
  task_deleted: 'Task Deleted',
  password_updated: 'Password Updated',
  email_updated: 'Email Updated',
  profile_updated: 'Profile Updated',
  welcome_aboard: 'Welcome Aboard',
  password_reset: 'Password Reset',
};

export function timeAgo(date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
