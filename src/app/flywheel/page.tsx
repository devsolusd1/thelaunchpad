import { redirect } from 'next/navigation';

// A antiga pagina Flywheel virou a pagina do token: /pad
export default function FlywheelRedirect() {
  redirect('/pad');
}
